import { Box } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useAccountNames } from '../contexts/AccountNamesContext'
import { AccountBadge, IconSizeVariant } from '../types'
import { getDisplayAddress } from '../utils'
import IdenticonBadge from './IdenticonBadge'
import { useApi } from '../contexts/ApiContext'
import IdentityIcon from './IdentityIcon'
import Balance from './library/Balance'
import { useGetEncodedAddress } from '../hooks/useGetEncodedAddress'
import { useIdentity } from '../hooks/useIdentity'

interface Props {
  address: string
  className?: string
  badge?: AccountBadge
  withName?: boolean
  withBalance?: boolean
  iconSize?: IconSizeVariant
}

const AccountDisplay = ({
  className,
  address,
  badge,
  withName = true,
  withBalance = false,
  iconSize = 'medium'
}: Props) => {
  const { getNamesWithExtension } = useAccountNames()
  const localName = useMemo(() => getNamesWithExtension(address), [address, getNamesWithExtension])
  const { api } = useApi()
  const [mainDisplay, setMainDisplay] = useState<string>('')
  const [sub, setSub] = useState<string | null>(null)
  const getEncodedAddress = useGetEncodedAddress()
  const encodedAddress = useMemo(() => getEncodedAddress(address), [address, getEncodedAddress])
  const identity = useIdentity(address)

  useEffect(() => {
    if (!identity) return

    if (identity.displayParent && identity.display) {
      // when an identity is a sub identity `displayParent` is set
      // and `display` get the sub identity
      setMainDisplay(identity.displayParent)
      setSub(identity.display)
    } else {
      // There should not be a `displayParent` without a `display`
      // but we can't be too sure.
      setSub('')
      setMainDisplay(identity.displayParent || identity.display || '')
    }
  }, [address, api, identity])

  return (
    <div className={className}>
      <IdenticonBadge
        badge={badge}
        address={encodedAddress}
        size={iconSize}
      />
      <BoxStyled>
        {withName && (
          <NameWrapperStyled>
            {!!identity && mainDisplay && (
              // Class name for external styling
              // Do not remove
              <IdentityIcon
                className="identityBadge"
                identity={identity}
              />
            )}
            {/*// Class name for external styling*/}
            {/* // Do not remove */}
            <NameStyled
              className="multisigName"
              data-cy="label-account-name"
            >
              {localName || mainDisplay}
              {!!sub && <span className="subIdentity">/{sub}</span>}
            </NameStyled>
          </NameWrapperStyled>
        )}
        <AddressStyled
          className="multisigAddress"
          data-cy="label-account-address"
        >
          {getDisplayAddress(encodedAddress)}
        </AddressStyled>
        {withBalance && (
          <Box>
            <Balance address={address} />
          </Box>
        )}
      </BoxStyled>
    </div>
  )
}

const BoxStyled = styled(Box)`
  min-width: 0;
  margin-left: 0.5rem;
  display: grid !important;
  justify-content: start;
  justify-items: start;
`

const NameWrapperStyled = styled('div')`
  display: flex;
  grid-auto-flow: column;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .subIdentity {
    margin-left: 0.3rem;
    font-weight: 300;
    font-size: 0.8rem;
  }
`

const AddressStyled = styled('div')`
  color: ${({ theme }) => theme.custom.text.primary};
  font-size: 1rem;
  font-weight: 400;
`

const NameStyled = styled('div')`
  color: ${({ theme }) => theme.custom.text.primary};
  font-size: 1rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default styled(AccountDisplay)`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;

  .identityBadge {
    margin-right: 0.3rem;
    height: 1.5rem;
    width: 1.5rem;
  }
`
