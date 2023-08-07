import React from 'react';
import { Button, ButtonProps } from '@mui/base';
import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import useResizeObserver from '../../utils/hooks/useResizeObserver';
import { BackgroundContext } from '../BackgroundContext';

interface StyledButtonProps {
  width: number;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (propName) => propName !== 'width',
})<StyledButtonProps>(({ width }) => ({
  display: 'block',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  width: `${width}px`,
  height: `${width}px`,
  borderRadius: '50%',
  position: 'relative',
}));

const Circle = styled(animated.div)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.charcoal}`,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
}));

const ArrowMask = styled(animated.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  margin: 'auto',
  height: '100%',
  width: '100%',
  background: theme.palette.common.charcoal,
  mask: 'url(/arrow-small.svg) no-repeat center center',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    mask: 'url(/arrow.svg) no-repeat center center',
  },
}));

const Overlay = styled(animated.div)(() => ({
  pointerEvents: 'none',
  width: '150%',
  height: '200%',
  borderRadius: '50%',
  position: 'absolute',
  top: '-50%',
  left: '-25%',
}));

const TextMask = styled(animated(Typography))(() => ({
  position: 'absolute',
  pointerEvents: 'none',
  margin: 'auto',
  top: 0,
  color: 'transparent',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundSize: '200% 300%',
  backgroundClip: 'text',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface Props extends ButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
}

export default function CircleButton(props: Props) {
  const { label, href, onClick } = props;

  const theme = useTheme();
  const { lightBeige, beige, charcoal } = theme.palette.common;
  const isTablet = useMediaQuery(theme.breakpoints.up('md'));
  const { isLight } = React.useContext(BackgroundContext);
  const { ref, clientHeight, clientWidth } = useResizeObserver();

  const [isHovering, setIsHovering] = React.useState(false);

  const BUTTON_WIDTH_XS = label ? 100 : 74;
  const BUTTON_WIDTH_MD = 142;

  const width = isTablet ? BUTTON_WIDTH_MD : BUTTON_WIDTH_XS;

  const bind = useGesture({
    onHover: ({ hovering }) => {
      setIsHovering(hovering ?? false);
      scaleApi.start({
        to: { scale: hovering ? 1.3 : 1 },
      });
    },
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const clientTop = ref.current?.getBoundingClientRect().top ?? 0;
    const clientLeft = ref.current?.getBoundingClientRect().left ?? 0;

    positionApi.start({
      xy: [
        e.clientX - (clientLeft + clientWidth / 2),
        e.clientY - (clientTop + clientHeight / 2),
      ],
    });
  };

  const handleMouseLeave = () => {
    positionApi.start({
      xy: [0, 0],
    });
  };

  const handleClick = () => {
    scaleApi.start({
      to: [{ scale: isTablet ? 1.2 : 0.9 }, { scale: isTablet ? 1.3 : 1 }],
      config: { precision: 0.01, mass: 0.5, friction: 10 },
    });

    if (href && href[0] === '#') {
      const el = document.getElementById(href.split('#')[1]);
      if (el) {
        window.scrollTo({
          top: window.scrollY + el.getBoundingClientRect().top - 96,
          left: 0,
          behavior: 'smooth',
        });
      }
    }

    if (onClick) onClick();
  };

  // background color
  const { backgroundColor, backgroundImage } = useSpring({
    backgroundColor: isLight ? lightBeige : beige,
    backgroundImage: isLight
      ? `linear-gradient(180deg, ${charcoal} 0%, ${charcoal} 50%, ${lightBeige} 50%)`
      : `linear-gradient(180deg, ${charcoal} 0%, ${charcoal} 50%, ${beige} 50%)`,
  });

  // 'magnet' movement spring
  // use interpolation to allow the effect of the text/icon moving less than the outer circle
  const [{ xy }, positionApi] = useSpring(() => ({
    xy: [0, 0],
  }));

  // scale spring
  const [{ scale }, scaleApi] = useSpring(() => ({
    to: { scale: isHovering ? 1.3 : 1 },
  }));

  // colour fill spring
  // add deps so that background doesn't move when 'isLight' changes
  const [{ transform }] = useSpring(
    () => ({
      from: { transform: 'translateY(75%)' },
      to: { transform: isHovering ? 'translateY(0%)' : 'translateY(-75%)' },
      reset: isHovering,
    }),
    [isHovering],
  );

  // text clip background
  // add deps so that background doesn't move when 'isLight' changes
  const [textSpring] = useSpring(
    () => ({
      from: { backgroundPositionY: '0%', fontSize: isTablet ? 14 : 12 },
      to: isHovering
        ? { backgroundPositionY: '100%', fontSize: isTablet ? 12 : 10 }
        : [
            { backgroundPositionY: '-75%', immediate: true },
            { backgroundPositionY: '0%', fontSize: isTablet ? 14 : 12 },
          ],
    }),
    [isHovering],
  );

  return (
    <Box
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      width={`${width}px`}
      height={`${width}px`}
    >
      <StyledButton
        {...bind()}
        href={href}
        onClick={handleClick}
        width={width}
        style={{ background: backgroundColor }}
      >
        <Circle
          style={{
            scale,
            transform: xy.to((x, y) => `translate(${x * 0.3}px, ${y * 0.3}px)`),
          }}
        >
          <Overlay style={{ transform, background: charcoal }} />
        </Circle>
        {label && (
          <TextMask
            variant="button"
            style={{
              transform: xy.to(
                (x, y) => `translate(${x * 0.2}px, ${y * 0.2}px)`,
              ),
              backgroundImage,
              ...textSpring,
            }}
          >
            {label}
          </TextMask>
        )}
        {!label && (
          <ArrowMask
            style={{
              transform: xy.to(
                (x, y) => `translate(${x * 0.2}px, ${y * 0.2}px)`,
              ),
            }}
          >
            <Overlay
              style={{ scale, transform, background: backgroundColor }}
            />
          </ArrowMask>
        )}
      </StyledButton>
    </Box>
  );
}
