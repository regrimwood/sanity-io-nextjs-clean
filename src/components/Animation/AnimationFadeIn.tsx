import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { Box, BoxProps } from '@mui/material';

interface Props extends BoxProps {
  threshold?: number;
  delay?: number;
  style?: React.CSSProperties;
}

const AnimatedBox = animated(Box);

export default function AnimationFadeIn(props: React.PropsWithChildren<Props>) {
  const { children, threshold = 1, delay, ...restProps } = props;

  const { ref, inView } = useInView({ triggerOnce: true, threshold });

  const spring = useSpring({
    zIndex: 1,
    opacity: inView ? 1 : 0,
    scale: inView ? 1 : 0.98,
    delay,
  });

  return (
    <AnimatedBox style={spring} ref={ref} {...restProps}>
      {children}
    </AnimatedBox>
  );
}
