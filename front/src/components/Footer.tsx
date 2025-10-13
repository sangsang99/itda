import { Layout } from 'antd'
import styled from 'styled-components'

const { Footer: AntFooter } = Layout

const StyledFooter = styled(AntFooter)`
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  padding: 24px 50px;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const FooterText = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
`

const Copyright = styled.div`
  font-size: 12px;
  opacity: 0.8;
`

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <FooterContent>
        <FooterText>
          잇다(ITDA) - 교육의 미래를 잇다 🌳
        </FooterText>
        <Copyright>
          © 2025 ITDA Platform. All rights reserved.
        </Copyright>
      </FooterContent>
    </StyledFooter>
  )
}

export default Footer