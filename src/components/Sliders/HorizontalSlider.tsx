import { animated, useSpring } from '@react-spring/web';
import { Box, BoxProps, Stack, styled } from '@mui/material';
import React from 'react';
import { useDrag } from '@use-gesture/react';
import useResizeObserver from '../../utils/hooks/useResizeObserver';

const Root = styled(Box)(() => ({
  position: 'relative',
}));

const TouchWrapper = styled(animated.div)(() => ({
  touchAction: 'pan-y',
}));

export interface HorizontalSliderProps extends BoxProps {
  px?: number;
  spacing?: number;
}

export default function HorizontalSlider(props: HorizontalSliderProps) {
  const { children, spacing = 2.5, px = 1.875, ...restProps } = props;
  const paddingXPx = px * 8;

  const [maxScroll, setMaxScroll] = React.useState(0);

  const { ref, clientWidth } = useResizeObserver();
  const { ref: childRef, clientWidth: childWidth } = useResizeObserver();

  const [spring, springApi] = useSpring(() => ({
    x: 0,
  }));

  const bind = useDrag(
    ({ active, offset: [ox] }) => {
      if (active) {
        springApi.start(() => ({
          x: ox,
        }));
      }
    },
    {
      from: () => [spring.x.get(), 0],
      bounds: { right: 0, left: maxScroll === -paddingXPx ? 0 : maxScroll },
      filterTaps: true, // prevent click after drag
    },
  );

  React.useEffect(() => {
    setMaxScroll(-(childWidth - clientWidth + paddingXPx * 2));
    springApi.start({ x: 0 });
  }, [clientWidth, childWidth, springApi, paddingXPx]);

  return (
    <Root ref={ref} px={px} {...restProps}>
      <TouchWrapper style={spring} {...bind()}>
        <Stack
          ref={childRef}
          direction="row"
          columnGap={spacing}
          width="fit-content"
        >
          {children}
        </Stack>
      </TouchWrapper>
    </Root>
  );
}
