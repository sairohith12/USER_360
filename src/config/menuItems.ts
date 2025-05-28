import { AutoStories, KeyOff, SpaceDashboard, SvgIconComponent } from '@mui/icons-material'
import React from 'react'
export interface MenuItem {
  label: string
  path?: string
  roles: string[]
  icon?: SvgIconComponent
  Component?: React.FC
  subItems?: MenuItem[]
}

import {
  MonetizationOn,
  VpnKey,
  CardGiftcard,
  Autorenew,
  CreditCard,
  Replay,
  // AccessTime,
  Assessment,
  Redeem,
  AdminPanelSettings,
  SupervisorAccount,
} from '@mui/icons-material'
import PlaceholderComponent from '@/components/Placeholder'
import NeucoinsRedemptionAndTabs from '@/components/Redemption/NeucoinsRedemptionAndTabs'
import GiftCardsRedemptionsAndTabs from '@/components/Redemption/GiftCardRedemptionAndTabs'
import VoucherRedemptionAndTabs from '@/components/Redemption/VoucherRedemptionAndTabs'
import NeucoinsReinstateAndTabs from '@/components/Reinstate/NeucoinsReinstateAndTabs'
import GiftCardReinstateAndTabs from '@/components/Reinstate/GiftCardReinstateAnsTabs'
import VoucherReinstateAndTabs from '@/components/Reinstate/VoucherReinstateAndTabs'
import PaymentJourney from '@/components/CCAvenue/Payments'
import RefundsJourney from '@/components/CCAvenue/Refunds'
import AccessControl from '@/components/admin/AccessControl'
import AuditLogs from '@/components/admin/AuditLogs'
import AdminDashboard1 from '@/components/admin/AdminDashboard1'
import ManageAdmins from '@/components/admin/ManageAdmin'
import UserDashboard from '@/components/UserDashboard'
// import GiftCardExpiryExtension from '@/components/ExpiryExtensions/GiftCardExpiryExtension'
// import VoucherExtension from '@/components/ExpiryExtensions/VoucherExtension'

export const menuItems: MenuItem[] = [
  {
    label: 'Redemption',
    roles: ['admin', 'editor', 'viewer', 'super_admin'],
    icon: Redeem,
    subItems: [
      {
        label: 'Neucoins',
        path: '/redemption/neucoins',
        roles: ['admin', 'editor', 'viewer', 'super_admin'],
        icon: MonetizationOn,
        Component: NeucoinsRedemptionAndTabs,
      },
      {
        label: 'GiftCard (Taj Experience)',
        path: '/redemption/giftcard',
        roles: ['admin', 'editor', 'viewer', 'super_admin'],
        icon: VpnKey,
        Component: GiftCardsRedemptionsAndTabs,
      },
      {
        label: 'Vouchers',
        path: '/redemption/vouchers',
        roles: ['admin', 'editor', 'viewer', 'super_admin'],
        icon: CardGiftcard,
        Component: VoucherRedemptionAndTabs,
      },
    ],
  },
  {
    label: 'Re-Instate',
    roles: ['admin', 'editor', 'super_admin'],
    icon: Autorenew,
    subItems: [
      {
        label: 'Neucoins',
        path: '/reinstate/neucoins',
        roles: ['admin', 'editor', 'super_admin'],
        icon: MonetizationOn,
        Component: NeucoinsReinstateAndTabs,
      },
      {
        label: 'GiftCard (Taj Experience)',
        path: '/reinstate/giftcard',
        roles: ['admin', 'editor', 'super_admin'],
        icon: VpnKey,
        Component: GiftCardReinstateAndTabs,
      },
      {
        label: 'Vouchers',
        path: '/reinstate/vouchers',
        roles: ['admin', 'editor', 'super_admin'],
        icon: CardGiftcard,
        Component: VoucherReinstateAndTabs,
      },
    ],
  },
  // {
  //   label: 'Expiry Extensions',
  //   roles: ['admin', 'editor'],
  //   icon: AccessTime,
  //   subItems: [
  //     {
  //       label: 'GiftCard (Taj Experience)',
  //       path: '/expiry-extensions/giftcard',
  //       roles: ['admin', 'editor'],
  //       icon: VpnKey,
  //       Component: GiftCardExpiryExtension,
  //     },
  //     {
  //       label: 'Vouchers',
  //       path: '/expiry-extensions/vouchers',
  //       roles: ['admin', 'editor'],
  //       icon: CardGiftcard,
  //       Component: VoucherExtension,
  //     },
  //   ],
  // },
  {
    label: 'CC Avenue',
    roles: ['admin', 'super_admin'],
    icon: CreditCard,
    subItems: [
      {
        label: 'Payments',
        path: '/cc-avenue/payments',
        roles: ['admin', 'super_admin'],
        icon: CreditCard,
        Component: PaymentJourney,
      },
      {
        label: 'Refunds',
        path: '/cc-avenue/refunds',
        roles: ['admin', 'super_admin'],
        icon: Replay,
        Component: RefundsJourney,
      },
    ],
  },

  // {
  //   label: 'GiftCard Activation',
  //   path: '/giftcard-activation',
  //   roles: ['admin', 'editor'],
  //   icon: VpnKey,
  //   Component: PlaceholderComponent,
  // },
  {
    label: 'MIS & Reports',
    path: '/mis-reports',
    roles: ['admin', 'editor', 'viewer', 'super_admin'],
    icon: Assessment,
    Component: UserDashboard,
  },
  {
    label: 'Control Hub',
    roles: ['admin', 'super_admin'],
    icon: AdminPanelSettings,
    subItems: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        roles: ['admin', 'super_admin'],
        icon: SpaceDashboard,
        Component: AdminDashboard1,
      },
      {
        label: 'Manage Admins',
        path: '/admin/manage-admins',
        roles: ['admin', 'super_admin'],
        icon: SupervisorAccount,
        Component: ManageAdmins,
      },
      {
        label: 'Access Control',
        path: '/admin/access-control',
        roles: ['admin', 'super_admin'],
        icon: KeyOff,
        Component: AccessControl,
      },
      {
        label: 'Audit Logs',
        path: '/admin/audit-logs',
        roles: ['admin', 'super_admin'],
        icon: AutoStories,
        Component: AuditLogs,
      },
    ],
  },
]
