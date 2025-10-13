import { Card, Row, Col, Typography, Button, Space } from 'antd'
import {
  BookOutlined,
  TeamOutlined,
  StarOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import styled from 'styled-components'

const { Title, Paragraph } = Typography

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
`

const SectionTitle = styled(Title)`
  &&& {
    color: white;
    margin-bottom: 16px;
  }
`

const FeatureCard = styled(Card)`
  height: 280px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`

const IconWrapper = styled.div`
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
  text-align: center;
`

const StatsSection = styled.div`
  background: #f8f9fa;
  padding: 40px;
  border-radius: 12px;
  margin: 40px 0;
`

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
`

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <BookOutlined />,
      title: '풍부한 교수학습자료',
      description: '교과, 비교과, 요소자료 등 체계적으로 분류된 다양한 교육 콘텐츠를 제공합니다.',
    },
    {
      icon: <TeamOutlined />,
      title: '채널 시스템',
      description: '교원, 기관, 전문가들의 개인 채널을 통해 양질의 교육 자료를 구독하고 공유하세요.',
    },
    {
      icon: <StarOutlined />,
      title: '맞춤형 추천',
      description: '사용자의 관심사와 활동 패턴을 분석하여 개인화된 교육 자료를 추천해드립니다.',
    },
    {
      icon: <TrophyOutlined />,
      title: '올해의 채널',
      description: '우수한 콘텐츠로 선정된 올해의 채널 뱃지 수여 채널들의 특별한 자료를 만나보세요.',
    },
    {
      icon: <PlayCircleOutlined />,
      title: '영상 매뉴얼',
      description: '단계별 영상 가이드를 통해 플랫폼 사용법을 쉽고 빠르게 익힐 수 있습니다.',
    },
    {
      icon: <FileTextOutlined />,
      title: '꾸러미 제작',
      description: '여러 콘텐츠를 모아 체계적인 수업안(꾸러미)을 제작하고 공유할 수 있습니다.',
    },
  ]

  const stats = [
    { number: '10,000+', label: '등록된 콘텐츠' },
    { number: '2,500+', label: '활성 채널' },
    { number: '50,000+', label: '활성 사용자' },
    { number: '1,200+', label: '제작된 꾸러미' },
  ]

  return (
    <Container>
      <HeroSection>
        <SectionTitle level={1}>
          교육의 미래를 잇다 🌳
        </SectionTitle>
        <Paragraph style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)' }}>
          교육자들을 위한 통합 교수학습자료 플랫폼, 잇다(ITDA)에서<br />
          양질의 교육 콘텐츠를 발견하고 공유하세요.
        </Paragraph>
        <Space size="large" style={{ marginTop: '24px' }}>
          <Button type="primary" size="large">
            시작하기
          </Button>
          <Button size="large" style={{ background: 'transparent', borderColor: 'white', color: 'white' }}>
            더 알아보기
          </Button>
        </Space>
      </HeroSection>

      <div style={{ marginBottom: '60px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          주요 기능
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <FeatureCard>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Title level={4} style={{ textAlign: 'center', marginBottom: '12px' }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ textAlign: 'center', color: '#666' }}>
                  {feature.description}
                </Paragraph>
              </FeatureCard>
            </Col>
          ))}
        </Row>
      </div>

      <StatsSection>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          잇다 플랫폼 현황
        </Title>
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <StatCard>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            </Col>
          ))}
        </Row>
      </StatsSection>
    </Container>
  )
}

export default HomePage