import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

const { Paragraph, Link } = Typography

const Container = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 24px;
`

const LoginCard = styled(Card)`
  width: 400px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
`

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`

const Logo = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
`

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }
`

const LoginButton = styled(Button)`
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
`

const SSOButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-color: #d9d9d9;
  color: #666;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`

const FooterLinks = styled.div`
  text-align: center;
  margin-top: 24px;
`

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated } = useAuth()

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onFinish = async (values: any) => {
    try {
      await login(values.username, values.password)
      message.success('로그인 성공!')
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
      message.error(errorMessage)
    }
  }

  return (
    <Container>
      <LoginCard>
        <LogoSection>
          <Logo>잇다</Logo>
          <Paragraph style={{ color: '#666', margin: 0 }}>
            교육의 미래를 잇다 🌳
          </Paragraph>
        </LogoSection>

        <StyledForm
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '사용자명을 입력해주세요!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="사용자명"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <LoginButton type="primary" htmlType="submit" loading={loading}>
              로그인
            </LoginButton>
          </Form.Item>
        </StyledForm>

        <Divider>또는</Divider>

        <SSOButton icon={<GoogleOutlined />}>
          에듀넷 SSO 로그인
        </SSOButton>

        <FooterLinks>
          <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
            <Link>비밀번호 찾기</Link>
            <Link>회원가입</Link>
            <Link>고객센터</Link>
          </Space>
        </FooterLinks>
      </LoginCard>
    </Container>
  )
}

export default LoginPage