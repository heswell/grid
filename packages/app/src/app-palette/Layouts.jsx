import {FlexboxLayout as Flexbox, Placeholder} from "@heswell/layout";

export const twoColumns = (
  <Flexbox style={{ flexDirection: 'column' }}>
    <Placeholder data-resizeable style={{ flex: 1 }} />
    <Placeholder data-resizeable style={{ flex: 1 }} />
  </Flexbox>
)
