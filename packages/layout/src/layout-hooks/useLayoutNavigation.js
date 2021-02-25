import { useCallback, useEffect, useRef } from 'react';
import { Action } from '../layout-action';
import { followPath, nextLeaf, previousLeaf } from '../utils';
import { useLayoutDispatch } from '../LayoutContext';

// TODO need to be able to disable navigation if not required
function getNextTarget(root, { type, path, focusVisible, index }) {
  if (type === 'View') {
    if (focusVisible) {
      return nextLeaf(root, path);
    } else {
      return followPath(root, path);
    }
  } else {
    return nextLeaf(root, `${path}.${index}`);
  }
}

function getPrevTarget(root, { type, path, focusVisible, index }) {
  if (type === 'View') {
    if (focusVisible) {
      return previousLeaf(root, path);
    } else {
      return followPath(root, path);
    }
  } else {
    return previousLeaf(root, `${path}.${index}`);
  }
}

function focusElement(root, path) {
  const {
    props: { id, layoutId = id },
  } = followPath(root, path);
  const el = document.getElementById(layoutId);
  el.focus();
}
function addFocusVisible(root, path) {
  const {
    props: { id, layoutId = id },
  } = followPath(root, path);
  const el = document.getElementById(layoutId);
  el.classList.add('focus-visible');
}

function removeFocusVisible(root, path) {
  const {
    props: { id, layoutId = id },
  } = followPath(root, path);
  const el = document.getElementById(layoutId);
  el.classList.remove('focus-visible');
}

export default function useLayoutNavigation(
  layoutType,
  props,
  layoutRef,
  stateRef,
) {
  const dispatch = useLayoutDispatch();
  const isRoot = dispatch === null;
  const withFocus = useRef(null);

  const navHandler = useCallback((e) => {
    if (e.key === 'F6') {
      const target = e.shiftKey
        ? getPrevTarget(stateRef.current, withFocus.current)
        : getNextTarget(stateRef.current, withFocus.current);
      if (
        withFocus.current?.type === 'View' &&
        withFocus.current?.focusVisible
      ) {
        removeFocusVisible(stateRef.current, withFocus.current.path);
      }
      if (target) {
        const { 'data-path': dataPath, path = dataPath } = target.props;
        if (path === withFocus.current?.path) {
          withFocus.current.focusVisible = true;
          addFocusVisible(stateRef.current, withFocus.current.path);
        } else {
          withFocus.current = {
            type: 'View',
            path,
            focusing: true,
          };
          focusElement(stateRef.current, path);
        }
      }
    }
  }, []);

  useEffect(() => {
    function onFocus(e) {
      dispatch({
        type: Action.FOCUS,
        path: props.path,
      });
    }
    function onBlur(e) {
      dispatch({
        type: Action.BLUR,
        path: props.path,
        relatedTarget: e.relatedTarget,
      });
    }

    const layoutEl = layoutRef.current;

    if (layoutType === 'View') {
      layoutEl.addEventListener('blur', onBlur, true);
      layoutEl.addEventListener('focus', onFocus, true);
    }
    return () => {
      if (layoutType === 'View') {
        layoutEl.removeEventListener('blur', onBlur, true);
        layoutEl.removeEventListener('focus', onFocus, true);
      }
    };
  }, [dispatch, layoutRef, layoutType, props]);

  const dispatcher = isRoot
    ? (action) => {
        if (action.type === Action.FOCUS) {
          if (withFocus.current?.path !== action.path) {
            if (withFocus.current === null) {
              window.addEventListener('keyup', navHandler);
            } else if (withFocus.current.focusVisible) {
              removeFocusVisible(stateRef.current, withFocus.current.path);
            }

            withFocus.current = {
              type: 'View',
              path: action.path,
            };
          } else if (withFocus.current?.focusVisible) {
            removeFocusVisible(stateRef.current, withFocus.current.path);
            withFocus.current.focusVisible = false;
          } else if (withFocus.current?.focusing) {
            withFocus.current.focusVisible = true;
            addFocusVisible(stateRef.current, withFocus.current.path);
          }
          return true;
        } else if (
          action.type === Action.BLUR ||
          action.type === Action.BLUR_SPLITTER
        ) {
          if (!layoutRef.current.contains(action.relatedTarget)) {
            if (withFocus.current?.focusVisible) {
              removeFocusVisible(stateRef.current, withFocus.current?.path);
            }
            withFocus.current = null;
            window.removeEventListener('keyup', navHandler);
          }
          return true;
        } else if (action.type === Action.FOCUS_SPLITTER) {
          if (withFocus.current?.type === 'View') {
            removeFocusVisible(stateRef.current, withFocus.current?.path);
          }
          withFocus.current = {
            type: 'Splitter',
            path: action.path,
            index: action.index,
          };
          return true;
        } else {
          // return customDispatcher && customDispatcher(action);
          return false;
        }
      }
    : undefined;

  // Navigation is only handled at root layout
  return dispatcher;
}
