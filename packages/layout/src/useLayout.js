import { useEffect, useRef, useState } from 'react';
import layoutReducer from './layout-reducer';
import { applyLayout } from './layoutUtils'; // TODO allow props to specify layoutRoot
import useNavigation from './layout-hooks/useLayoutNavigation';
import { useLayoutDispatch } from './LayoutContext';

/**
 * Root layout node will never receive dispatch. It may receive a layoutModel,
 * in which case UI will be built from model. Only root stores layoutModel in
 * state and only root updates layoutModel. Non-root layout nodes always return
 * layoutModel from props. Root node, if seeded with layoutModel stores this in
 * state and subsequently manages layoutModel in state.
 */
const useLayout = (layoutType, props) => {
  const dispatch = useLayoutDispatch();
  const isRoot = dispatch === null;
  const ref = useRef(null);
  // Only the root layout actually stores state here
  const state = useRef(undefined);
  const children = useRef(null);
  // AKA forceRefresh
  const [, setState] = useState(0);
  const layout = useRef(props.layout);

  const navigationDispatcher = useNavigation(layoutType, props, ref, state);

  const dispatchLayoutAction = useRef(
    dispatch ||
      ((action) => {
        // A custom dispatcher should return true to indicate that it has handled this action.
        // A custom dispatcher alone will not refresh the layout state, it must ultimately
        // dispatch a  layout action that will be handled below.It can be used to defer an action
        // that has async pre-requisites or initiate an operation that may or may not progress
        // to actual layour re-render e.g layout drag drop.
        if (navigationDispatcher && navigationDispatcher(action)) {
          return;
        }

        console.log(
          `useLayout (${layoutType}) about to reduce ${action.type} ${action.path}`,
        );
        const nextState = layoutReducer(state.current, action);
        if (nextState !== state) {
          state.current = nextState;
          setState((c) => c + 1);
          if (props.onLayoutChange) {
            // TODO serialize layout
            // TODO we have a circular deopendency in tree after a drag-start
            //props.onLayoutChange(layoutToJSON(layoutType, props, nextState));
          }
        }
      }),
  );

  // Detect dynamic layout reset from serialized layout
  useEffect(() => {
    if (props.layout !== layout.current) {
      state.current = applyLayout(layoutType, props);
      setState((c) => c + 1);
      layout.current = props.layout;
    }
  }, [layoutType, props]);

  if (
    isRoot &&
    (state.current === undefined || children.current !== props.children)
  ) {
    // console.log(
    //   `LAYOUT ROOT COMPONENT (${layoutType})_____ (useLayout regenerated layout structure)`
    // );
    children.current = props.children;
    // TODO should be a call to the reducer
    state.current = applyLayout(layoutType, props, state.current);
    //console.log(state.current);
  }

  const layoutProps = isRoot ? state.current : props;
  return [layoutProps, ref, dispatchLayoutAction.current, isRoot];
};

export default useLayout;
