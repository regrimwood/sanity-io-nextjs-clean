import React from 'react';
import {
  AppBar,
  Stack,
  styled,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Drawer,
  useScrollTrigger,
  alpha,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { animated, useSpring } from '@react-spring/web';
import { useHover } from '@use-gesture/react';
import { HOME_PAGE } from '../utils/routes';
import Hamburger from '../assets/icons/hamburger.svg';
import ContentContainer from './ContentContainer';
import AnimatedImage from './AnimatedImage';

export const NAV_HEIGHT_MD = 100;
export const NAV_HEIGHT_XS = 72;

const StyledAppBar = styled(animated(AppBar))(() => ({
  color: 'unset',
}));

const LogoContainer = styled(Link)(({ theme }) => ({
  display: 'block',
  height: '40.77px',
  width: '140px',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    height: '32.03px',
    width: '110px',
  },
}));

export default function NavBar() {
  const theme = useTheme();
  const { charcoal, solidWhite } = theme.palette.common;
  const isTablet = useMediaQuery(theme.breakpoints.up('md'));

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const router = useRouter();

  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const hoverBind = useHover(({ hovering }) => {
    setIsHovering(hovering ?? false);
  });

  const backdropFadeIn = useSpring({
    backgroundColor:
      isHovering || scrollTrigger ? solidWhite : alpha(solidWhite, 0),
  });

  React.useEffect(() => {
    const onRouteChangeStart = () => {
      setMenuOpen(false);
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [router.events]);

  return (
    <StyledAppBar elevation={0} {...hoverBind()} style={backdropFadeIn}>
      <ContentContainer>
        <Stack
          py={{ xs: 2.5, md: 3.75 }}
          direction="row"
          alignItems="center"
          height={isTablet ? `${NAV_HEIGHT_MD}px` : `${NAV_HEIGHT_XS}px`}
          position="relative"
          zIndex={1}
        >
          <Box flexGrow={1}>
            <LogoContainer href={HOME_PAGE}>
              {/* <AnimatedImage
                src={logo.sourceUrl}
                alt={logo.altText}
                sizes="140px"
              /> */}
            </LogoContainer>
          </Box>
          {isTablet && (
            <Stack direction="row" spacing={3.75} px={3.75}>
              {/* {headerMenu?.menuItems.nodes.map((menuItem) => (
                <LinkButton
                  key={menuItem.id}
                  reverse
                  label={menuItem.label}
                  underlinePadding={0.25}
                  href={getPathFromCmsUrl(menuItem.url)}
                  typographyVariant="button"
                  pt="5px"
                />
              ))} */}
            </Stack>
          )}
          <IconButton
            sx={{ marginLeft: { xs: 0.5, md: 1.75 }, paddingRight: 0 }}
            onClick={() => setMenuOpen(true)}
            disableRipple
          >
            <Hamburger height="16px" width="21px" color={charcoal} />
          </IconButton>
        </Stack>
      </ContentContainer>
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: charcoal,
          },
        }}
      >
        {/* <MainMenu
          headerMenu={headerMenu}
          secondaryMenu={secondaryMenu}
          contactDetails={contactDetails}
          setMenuOpen={setMenuOpen}
          claimForms={claimForms}
          disclosurePageContent={disclosurePageContent}
          disclosurePdfs={disclosurePdfs}
          aboutPage={aboutPage}
        /> */}
      </Drawer>
    </StyledAppBar>
  );
}
