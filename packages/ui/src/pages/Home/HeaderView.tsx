import AccountDisplay from '../../components/AccountDisplay'
import { AccountBadge } from '../../types'
import MultisigActionMenu from './MultisigActionMenu'
import { styled } from '@mui/material/styles'
import { useMultiProxy } from '../../contexts/MultiProxyContext'
import { Balance, ButtonWithIcon } from '../../components/library'
import { HiOutlineArrowLongRight } from 'react-icons/hi2'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'

const HeaderView = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedMultiProxy, selectedHasProxy, selectedIsWatched } = useMultiProxy()

  const selectedAddress = useMemo((): string => {
    return String(
      selectedHasProxy ? selectedMultiProxy?.proxy : selectedMultiProxy?.multisigs[0].address
    )
  }, [selectedHasProxy, selectedMultiProxy])

  return (
    <PureProxyWrapper data-cy="header-account">
      <OverviewWrapper>
        <ButtonWithIcon
          onClick={() => {
            navigate({
              pathname: '/overview',
              search: createSearchParams(searchParams).toString()
            })
          }}
          variant="link"
          data-cy="button-see-overview"
        >
          See overview
          <HiOutlineArrowLongRight size={24} />
        </ButtonWithIcon>
      </OverviewWrapper>
      <PureHeaderStyled>
        <AccountDisplayStyled
          iconSize={'large'}
          address={selectedAddress}
          badge={selectedHasProxy ? AccountBadge.PURE : AccountBadge.MULTI}
        />
        <BalanceStyledWrapper>
          <BalanceStyled>
            <BalanceHeaderStyled>Balance</BalanceHeaderStyled>
            <BalanceAmountStyled data-cy="label-account-balance">
              <Balance address={selectedAddress} />
            </BalanceAmountStyled>
          </BalanceStyled>
        </BalanceStyledWrapper>
        <BoxStyled>
          <MultisigActionMenu withNewTransactionButton={!selectedIsWatched} />
        </BoxStyled>
      </PureHeaderStyled>
    </PureProxyWrapper>
  )
}

const PureProxyWrapper = styled('div')`
  flex: 1;
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.custom.text.borderColor};
  border-radius: ${({ theme }) => theme.custom.borderRadius};
  margin-bottom: 1rem;
`

const OverviewWrapper = styled('div')`
  height: 3rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: ${({ theme }) => theme.custom.gray[300]};
  border-top-right-radius: ${({ theme }) => theme.custom.borderRadius};
  border-top-left-radius: ${({ theme }) => theme.custom.borderRadius};
`

const PureHeaderStyled = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 0 1rem 0.5rem;
  padding: 1rem 1.3rem 0 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.values.md}px) {
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
  }

  & > div:first-of-type {
    margin: auto auto 1rem auto;

    @media (min-width: ${({ theme }) => theme.breakpoints.values.md}px) {
      margin: initial;
    }
  }

  & > div:nth-of-type(2) {
    display: flex;
    flex-direction: row-reverse;
    justify-self: flex-end;
    justify-content: space-between !important;
    align-items: center;
    align-self: center;
    flex: 1;
    text-align: center;

    @media (min-width: ${({ theme }) => theme.breakpoints.values.md}px) {
      text-align: initial;
      justify-content: initial;
      align-self: flex-end;
      flex: 1;
      margin: 0;
    }
  }

  & > div:last-of-type {
    flex: 0;
    justify-content: center;
    align-self: center;
    margin-top: 1rem;
    margin-bottom: 0.25rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.values.md}px) {
      justify-content: flex-end;
      align-self: flex-end;
      margin-top: 0;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.values.md}px) {
    margin: 0 0 1rem 0;
  }
`

const AccountDisplayStyled = styled(AccountDisplay)`
  min-width: 0;

  .multisigName {
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.custom.gray[800]};
  }

  .multisigAddress {
    color: ${({ theme }) => theme.custom.text.secondary};
  }

  & > div:last-child {
    margin: 1.44rem 1.37rem 0.75rem 0.5rem;
  }
`

const BalanceStyledWrapper = styled('div')`
  align-self: flex-end;
  flex-direction: row;
`

const BalanceStyled = styled('div')`
  display: flex;
  justify-content: space-between;
  max-width: 19rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.custom.gray[200]};
  border-radius: ${({ theme }) => theme.custom.borderRadius};
  border: 1px solid ${({ theme }) => theme.custom.gray[400]};
`

const BalanceHeaderStyled = styled('div')`
  font-size: 1rem;
  color: ${({ theme }) => theme.custom.gray[700]};
  margin-right: 1rem;
`

const BalanceAmountStyled = styled('div')`
  font-size: 1rem;
  color: ${({ theme }) => theme.custom.gray[800]};
  white-space: nowrap;
`

const BoxStyled = styled('div')`
  display: flex;
  align-items: center;
  align-self: flex-end;

  @media (min-width: ${({ theme }) => theme.breakpoints.values.md}px) {
    padding-left: 1rem;
  }

  & > :last-child {
    margin-left: 0.25rem;
  }
`

export default HeaderView
