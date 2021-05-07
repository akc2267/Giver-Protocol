import { ReactElement } from 'react'
import styled from 'styled-components'

import { STYLE } from 'consts'

import { ExtLink, Text, Container, Row, Col } from 'components'

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 640px;
  margin-top: 28px;
  margin-bottom: 28px;
  opacity: 0.5;
  @media ${STYLE.media.mobile} {
    min-height: 100px;
  }
`

const StyledText = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  color: #1B4965;
  letter-spacing: -0.22px;
`

const StyledText1 = styled(Text)`
  font-size: 8px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  color: #1B4965;
  letter-spacing: -0.22px;
`

const Footer = (): ReactElement => {
  const community = [
    {
      href: `https://github.com/akc2267/Giver-Protocol`,
      title: 'Github',
    },
  ]
  return (
    <div>
    <StyledContainer>
          <h5 style={{color:'#1B4965'}}>* How this works:<br/><h6 style={{fontSize:'10px', color:'#1B4965'}}>
          100% of your selected UST is deposited into Anchor Protocol, where it will earn stable 20% APY.<br/>
           Immediately after deposit, 8.33% of your deposit will be donated to the selected charity.<br/>
           After 1 year, your savings deposit is expected to be worth 110% and your donation to be 10% of initial deposit<br/>
           Donations are sent to a wallet controlled by Team Archon with the selected charity in the Memo field.<br/>
           If Team Archon is unable to get the charity to accept your crypto donation, we will return your donation minus fees.
           </h6></h5>
    </StyledContainer>
    <StyledContainer>
      <Row>
        <Col>
          <StyledText>© Team Archon.
          </StyledText>
        </Col>
        {community.map(
          ({ href, title }) =>
            href && (
              <Col key={title} style={{ flex: '0 0 8%' }}>
                <ExtLink
                  href={href}
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontSize: 13,
                    textTransform: 'uppercase',
                  }}
                >
                  <StyledText>{title}</StyledText>
                </ExtLink>
              </Col>
            )
        )}
      </Row>
    </StyledContainer>
    <StyledContainer>
      <Row>
        <Col>
          <StyledText1>When High Templars (Charities) merge with Dark Templars (DeFi Degens), incredibly powerful change is created.</StyledText1>
        </Col>
      </Row>
    </StyledContainer>
    </div>
  )
}

export default Footer
