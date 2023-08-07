import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  styled,
  BoxProps,
  useTheme,
  TypographyPropsVariantOverrides,
} from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { Variant } from '@mui/material/styles/createTypography';
import { animated, config, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

const Root = styled(animated(Box))(() => ({
  pointerEvents: 'auto',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
}));

const Underline = styled(animated.div)(({ theme }) => ({
  backgroundColor: theme.palette.common.charcoal,
  opacity: 0.5,
  height: '1px',
}));

const StyledLink = styled(Link)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: 'fit-content',
}));

interface Props extends BoxProps {
  label: string;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  reverse?: boolean;
  typographyVariant?: OverridableStringUnion<
    Variant | 'inherit',
    TypographyPropsVariantOverrides
  >;
  containerIsHovering?: boolean;
  uppercase?: boolean;
  underlinePadding?: number;
}

export default function LinkButton(props: Props) {
  const {
    href,
    target,
    label,
    reverse = false,
    typographyVariant = 'body1',
    containerIsHovering,
    uppercase,
    underlinePadding = 0,
    ...restProps
  } = props;

  const [isHovering, setIsHovering] = React.useState(false);
  const [underlineWidth, setUnderlineWidth] = React.useState(
    reverse ? '100%' : '0%',
  );
  const [underlineAlign, setUnderlineAlign] = React.useState(true);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const theme = useTheme();
  const { charcoal } = theme.palette.common;
  const textTransform = uppercase ? 'uppercase' : 'none';

  const underlineSpring = useSpring({
    width: underlineWidth,
    backgroundColor: charcoal,
    alignSelf: underlineAlign ? 'flex-end' : 'flex-start',
    onStart: () => {
      setIsAnimating(true);
    },
    onResolve: () => {
      setIsAnimating(false);
    },
    config: { precision: 0.01, ...config.default },
  });

  const bind = useGesture({
    onHover: ({ hovering }) => {
      setIsHovering((hovering || containerIsHovering) ?? false);
    },
  });

  React.useEffect(() => {
    if (containerIsHovering) {
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  }, [containerIsHovering]);

  React.useEffect(() => {
    if (!isAnimating) {
      const hovering = reverse ? !isHovering : isHovering;
      setUnderlineAlign(!hovering);
      setUnderlineWidth(hovering ? '100%' : '0%');
    }
  }, [isAnimating, isHovering, reverse]);

  return (
    <Root {...bind()} {...restProps} color={charcoal}>
      {href && (
        <StyledLink href={href} target={target}>
          <Typography
            variant={typographyVariant}
            textTransform={textTransform}
            mb={underlinePadding}
            textAlign="left"
          >
            {label}
          </Typography>
        </StyledLink>
      )}

      {!href && (
        <Typography
          variant={typographyVariant}
          textTransform={textTransform}
          mb={underlinePadding}
          textAlign="left"
        >
          {label}
        </Typography>
      )}

      <Underline style={underlineSpring} />
    </Root>
  );
}
