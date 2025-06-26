// components/SidenavWithAccordions.tsx
import React, { useEffect, useMemo, useState } from 'react'
import {
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemText,
  Box,
  useMediaQuery,
  Theme,
  Typography,
  ListItemIcon,
  ListItem,
  Tooltip,
  IconButton,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../context/authContext'
import { menuItems } from '../config/menuItems'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useRouter } from 'next/router'
import NextLinkComposed from './NextLinkComposed'
import { useGuestContext } from '@/context/guestContext'
import { styled } from '@mui/material/styles'
import Image from 'next/image'

const drawerWidth = 340
const collapsedWidth = 80

interface Props {
  mobileOpen: boolean
  handleDrawerToggle: () => void
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease-in-out',
  '&::before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: '2px 4px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    borderLeft: `4px solid ${theme.palette.secondary.main}`,
    transition: 'background-color 0.3s ease, border 0.3s ease',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
  },
}))

const SidenavWithAccordions: React.FC<Props> = ({ mobileOpen, handleDrawerToggle }) => {
  const router = useRouter()
  const { userType, userSelectedProperty } = useAuth()
  const { updatedJourneyType } = useGuestContext()
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const isMobile = useMediaQuery('(max-width:480px)')
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const currentPath = router.asPath

  const filteredItems = useMemo(() => {
    if (!userSelectedProperty) return []

    return menuItems.reduce((acc: any, item) => {
      const sectionIdentifier = item?.identifier?.toLowerCase()
      const alwaysVisible = ['reports']

      if (sectionIdentifier && alwaysVisible.includes(sectionIdentifier)) {
        acc.push(item)
        return acc
      }

      if (sectionIdentifier === 'cc avenue') {
        const hasCCAvenueAccess = userSelectedProperty?.services?.some((section: any) =>
          section.modules.some((mod: any) => mod.name.toLowerCase() === 'cc avenue'),
        )

        if (hasCCAvenueAccess) {
          acc.push(item)
        }
        return acc
      }

      if (item?.label === 'Control Hub') {
        if (userType === 'super_admin') acc.push(item)
        return acc
      }
      const matchingSections = userSelectedProperty?.services?.filter(
        (record: any) => record?.name?.toLowerCase() === sectionIdentifier,
      )

      if (matchingSections?.length > 0) {
        if (item.subItems) {
          const subItems = item.subItems
            .map((sub) => {
              const subIdentifier = sub?.identifier?.toLowerCase()

              for (const section of matchingSections) {
                const foundModule = section?.modules?.find(
                  (mod: any) => mod?.name?.toLowerCase() === subIdentifier,
                )
                if (foundModule) {
                  return {
                    ...sub,
                    access_type: foundModule?.access_type,
                  }
                }
              }
              return null
            })
            .filter(Boolean)

          if (subItems.length > 0) {
            acc.push({ ...item, subItems })
          }
        } else {
          acc.push(item)
        }
      }

      return acc
    }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedProperty?.services, userType])
  const renderMenu = () => {
    return filteredItems?.map((item: any, index: number) => {
      const Icon = item.icon || FolderIcon
      const isDirectMatch = item.path && currentPath === item.path

      if (item.subItems && item.subItems.length > 0) {
        return (
          <StyledAccordion
            key={index}
            expanded={!isCollapsed && expandedAccordion === item.label}
            onChange={(_, isExpanded) => {
              setExpandedAccordion(isExpanded ? item.label : false)
            }}
            disableGutters
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon fontSize="small" />
                {!isCollapsed && (
                  <Typography variant="h5" fontWeight={600}>
                    {item.label}
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <List disablePadding>
                {item?.subItems?.map((subItem: any, subIndex: number) => {
                  const SubIcon = subItem.icon || InsertDriveFileIcon
                  const isSubActive = currentPath === subItem.path
                  if (!subItem.path) return null
                  return (
                    <StyledListItem
                      key={subIndex}
                      button
                      selected={isSubActive}
                      component={NextLinkComposed}
                      to={subItem.path!}
                      sx={{
                        pl: isCollapsed ? 2 : 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        if (isMobile) {
                          handleDrawerToggle() // 👈 close drawer on mobile
                        }
                        updatedJourneyType(subItem.path?.replaceAll('/', '-') || '')
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <SubIcon fontSize="small" />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={subItem.label}
                            sx={{ fontWeight: isSubActive ? 'bold' : 'normal' }}
                          />
                        )}
                      </Box>
                      {isSubActive && <ArrowRightIcon fontSize="medium" />}
                    </StyledListItem>
                  )
                })}
              </List>
            </AccordionDetails>
          </StyledAccordion>
        )
      }

      return (
        <StyledListItem
          key={index}
          button
          selected={isDirectMatch}
          component={NextLinkComposed}
          to={item.path!}
          sx={{
            pl: isCollapsed ? 2 : 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onClick={() => {
            if (isMobile) {
              handleDrawerToggle() // 👈 close drawer on mobile
            }
            updatedJourneyType(item.path?.replaceAll('/', '-') || '')
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={item.label}
                sx={{ fontWeight: isDirectMatch ? 'bold' : 'normal' }}
              />
            )}
          </Box>
          {isDirectMatch && <ArrowRightIcon fontSize="medium" />}
        </StyledListItem>
      )
    })
  }

  const drawerPaperStyle = {
    width: isCollapsed ? collapsedWidth : drawerWidth,
    boxSizing: 'border-box',
    top: '100px',
    height: 'calc(100% - 100px)',
    borderRight: '1px solid #e0e0e0',
    background: 'linear-gradient(180deg, #f9fafa 0%, #e0e0e0 100%)',
    padding: '16px 8px',
    transition: 'width 0.3s ease',
    '@media (max-width:480px)': {
      top: '88px',
      height: 'calc(100% - 88px)',
    },
  }

  useEffect(() => {
    setExpandedAccordion(filteredItems?.[0]?.label)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedProperty?.property?.hotel_name])

  return (
    <>
      {!isDesktop ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': drawerPaperStyle }}
        >
          <Box>{renderMenu()}</Box>
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': drawerPaperStyle }} open>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Box>
          <Box>{renderMenu()}</Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 8,
              right: 8,
              overflow: 'hidden',
              height: '92px',
              textAlign: 'center',
            }}
          >
            <Image
              src="/logo/user360_login_logo.png"
              alt="User360 Logo"
              width={isCollapsed ? 40 : 200}
              height={isCollapsed ? 40 : 60}
              style={{ objectFit: 'contain' }}
            />

            <Box
              sx={{
                display: 'inline-flex',
                width: 'max-content',
                animation: 'scrollLoop 15s linear infinite',
              }}
            >
              {/* Duplicate the content for seamless loop */}
              {[...Array(2)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pr: 4, // spacing between loops
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#2e3b55',
                      fontSize: '16px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    USER360 - The Ultimate Business Portal for Integrated Solutions · Reversals ·
                    Payments · Loyalty
                  </Typography>
                </Box>
              ))}
            </Box>

            <style jsx global>{`
              @keyframes scrollLoop {
                0% {
                  transform: translateX(0%);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
            `}</style>
          </Box>
        </Drawer>
      )}
    </>
  )
}

export default SidenavWithAccordions
