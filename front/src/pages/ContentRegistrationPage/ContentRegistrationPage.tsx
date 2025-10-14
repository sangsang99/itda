import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import Footer from '../../components/Footer';
import './ContentRegistrationPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:18080/api';

export const ContentRegistrationPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('school');
  const [schoolLevel, setSchoolLevel] = useState('');
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [achievementStandard, setAchievementStandard] = useState('');
  const [contentFormat, setContentFormat] = useState('attachment');
  const [contentUrl, setContentUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const [copyrightType, setCopyrightType] = useState('personal');
  const [usageCondition, setUsageCondition] = useState('publicDomain');
  const [publicStatus, setPublicStatus] = useState('public');
  const [storageType, setStorageType] = useState('channel');
  const [channelId, setChannelId] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [isSupportMaterial, setIsSupportMaterial] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert('콘텐츠명을 입력해주세요.');
      return;
    }

    if (!keywords.trim()) {
      alert('키워드를 입력해주세요.');
      return;
    }

    if (contentFormat !== 'url' && !file) {
      alert('파일을 선택해주세요.');
      return;
    }

    if (contentFormat === 'url' && !contentUrl.trim()) {
      alert('URL을 입력해주세요.');
      return;
    }

    if (storageType === 'channel' && !channelId) {
      alert('채널을 선택해주세요.');
      return;
    }

    if (storageType === 'storage' && !folderPath) {
      alert('폴더를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Add content JSON
      const contentRequest = {
        title: title.trim(),
        description: description.trim(),
        contentType,
        schoolLevel: schoolLevel || null,
        grade: grade || null,
        semester: semester || null,
        subject: subject || null,
        achievementStandard: achievementStandard.trim() || null,
        contentFormat,
        contentUrl: contentFormat === 'url' ? contentUrl.trim() : null,
        keywords: keywords.trim(),
        copyrightType,
        usageCondition,
        publicStatus,
        storageType,
        channelId: storageType === 'channel' && channelId ? parseInt(channelId) : null,
        folderPath: storageType === 'storage' ? folderPath : null,
        parentContentId: null,
        isSupportMaterial: false,
      };

      formData.append('content', new Blob([JSON.stringify(contentRequest)], { type: 'application/json' }));

      // Add file if present
      if (file) {
        formData.append('file', file);
      }

      // Add thumbnail if present
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      // Get user ID from session/token (임시로 1 사용)
      const userId = 8; // TODO: 실제 로그인된 사용자 ID 가져오기

      // API call
      const response = await fetch(`${API_BASE_URL}/contents`, {
        method: 'POST',
        headers: {
          'X-User-Id': userId.toString(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`등록 실패: ${errorText}`);
      }

      const result = await response.json();
      console.log('등록 성공:', result);

      alert('콘텐츠가 성공적으로 등록되었습니다.');
      navigate('/'); // 메인 페이지로 이동

    } catch (error) {
      console.error('등록 오류:', error);
      alert(error instanceof Error ? error.message : '콘텐츠 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="content-registration-page">
      <Header />

      <main className="registration-content">
        {/* Page Header */}
        <div className="registration-header">
          <div className="registration-header-inner">
            <div className="header-left-content">
              <div className="header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                  <path d="M9 8h6M9 12h6M9 16h4" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h1>콘텐츠 등록</h1>
                <p>다양한 유형의 콘텐츠를 등록하고 공유할 수 있습니다.</p>
              </div>
            </div>
            <div className="header-actions">
              <button type="button" className="btn btn-outline btn-pink">
                등록정보 제시용
              </button>
              <button type="button" className="btn btn-teal">
                콘텐츠만평
              </button>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">

            {/* 콘텐츠명 */}
            <div className="form-row">
              <label className="form-label required">콘텐츠명</label>
              <div className="form-control">
                <input
                  type="text"
                  className="input-field"
                  placeholder="콘텐츠명을 입력해 주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* 콘텐츠 분류 */}
            <div className="form-row">
              <label className="form-label required">콘텐츠 분류</label>
              <div className="form-control">
                <div className="radio-group horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="contentType"
                      value="school"
                      checked={contentType === 'school'}
                      onChange={(e) => setContentType(e.target.value)}
                    />
                    <span>교과</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="contentType"
                      value="non-school"
                      checked={contentType === 'non-school'}
                      onChange={(e) => setContentType(e.target.value)}
                    />
                    <span>비교과</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="contentType"
                      value="element"
                      checked={contentType === 'element'}
                      onChange={(e) => setContentType(e.target.value)}
                    />
                    <span>요소자료</span>
                  </label>
                </div>

                <div className="select-grid">
                  <select className="select-field" value={schoolLevel} onChange={(e) => setSchoolLevel(e.target.value)}>
                    <option value="">학교급</option>
                    <option value="elementary">초등학교</option>
                    <option value="middle">중학교</option>
                    <option value="high">고등학교</option>
                  </select>
                  <select className="select-field" value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="">학년</option>
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </select>
                  <select className="select-field" value={semester} onChange={(e) => setSemester(e.target.value)}>
                    <option value="">학기</option>
                    <option value="1">1학기</option>
                    <option value="2">2학기</option>
                  </select>
                  <select className="select-field" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">과목명</option>
                    <option value="korean">국어</option>
                    <option value="math">수학</option>
                    <option value="english">영어</option>
                    <option value="science">과학</option>
                    <option value="social">사회</option>
                  </select>
                </div>

                <input
                  type="text"
                  className="input-field"
                  placeholder="성취기준/단원 목 번(예:대단원 기 기준태준비 임)"
                  value={achievementStandard}
                  onChange={(e) => setAchievementStandard(e.target.value)}
                />

                <p className="helper-text error">* 선택한 분류(●)는 대표분류가 됩니다.</p>
              </div>
            </div>

            {/* 설명 */}
            <div className="form-row">
              <label className="form-label">설명</label>
              <div className="form-control">
                <textarea
                  className="textarea-field"
                  rows={5}
                  placeholder="설명을 입력해 주세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="form-row">
              <label className="form-label required">콘텐츠</label>
              <div className="form-control">
                <div className="radio-group horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="contentFormat"
                      value="attachment"
                      checked={contentFormat === 'attachment'}
                      onChange={(e) => setContentFormat(e.target.value)}
                    />
                    <span>콘텐츠 첨부</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="contentFormat"
                      value="file"
                      checked={contentFormat === 'file'}
                      onChange={(e) => setContentFormat(e.target.value)}
                    />
                    <span>파일</span>
                  </label>
                  {contentFormat === 'file' && (
                    <div className="file-upload-area">
                      <p className="upload-text">파일선택</p>
                      <p className="upload-hint">480 * 240 사이즈 권장(JPG, PNG, GIF, JPEG)</p>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        value={file?.name}
                      />
                    </div>
                  )}
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="contentFormat"
                      value="url"
                      checked={contentFormat === 'url'}
                      onChange={(e) => setContentFormat(e.target.value)}
                    />
                    <span>URL</span>
                  </label>
                  {contentFormat === 'url' && (
                    <div className="url-upload-area">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="URL을 입력해 주세요."
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 보조자료 */}
            <div className="form-row">
              <label className="form-label">보조자료</label>
              <div className="form-control">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isSupportMaterial}
                    onChange={(e) => setIsSupportMaterial(e.target.checked)}
                  />
                  <span>주 콘텐츠의 등록에 보조자료를 등록합니다. 보조자료는 주 콘텐츠 이외에 등록할 수 있는 자료입니다.</span>
                </label>
              </div>
            </div>

            {/* 대표 이미지 */}
            <div className="form-row">
              <label className="form-label">대표 이미지</label>
              <div className="form-control">
                <div className="file-upload-area">
                  <p className="upload-text">파일선택</p>
                  <p className="upload-hint">480 * 240 사이즈 권장(JPG, PNG, GIF, JPEG)</p>
                  <input
                    type="file"
                    onChange={handleThumbnailChange}
                    value={thumbnail?.name}
                  />
                </div>
              </div>
            </div>

            {/* 키워드 */}
            <div className="form-row">
              <label className="form-label required">키워드</label>
              <div className="form-control">
                <div className="input-with-button">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="키워드 기입 후 엔터(,)로 구분하다, 키워드는 최대한 많이 입력하세요.(추후 이기지를 통한 검색시)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <button type="button" className="btn btn-dark">
                    추천키워드
                  </button>
                </div>
              </div>
            </div>

            {/* 저작권 정보 */}
            <div className="form-row">
              <label className="form-label required">저작권 정보</label>
              <div className="form-control">
                <div className="radio-group horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="copyrightType"
                      value="personal"
                      checked={copyrightType === 'personal'}
                      onChange={(e) => setCopyrightType(e.target.value)}
                    />
                    <span>이용 허락(저작물 이용을 허락함)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="copyrightType"
                      value="shared"
                      checked={copyrightType === 'shared'}
                      onChange={(e) => setCopyrightType(e.target.value)}
                    />
                    <span>허락 필요(저작물 이용을 허락하지 않음)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 이용조건 */}
            <div className="form-row">
              <label className="form-label">이용조건</label>
              <div className="form-control">
                <div className="radio-group horizontal wrap">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="usageCondition"
                      value="publicDomain"
                      checked={usageCondition === 'publicDomain'}
                      onChange={(e) => setUsageCondition(e.target.value)}
                    />
                    <span>공공누리(공공저작물)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="usageCondition"
                      value="ccl"
                      checked={usageCondition === 'ccl'}
                      onChange={(e) => setUsageCondition(e.target.value)}
                    />
                    <span>CCL(자유이용허락)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="usageCondition"
                      value="copyright"
                      checked={usageCondition === 'copyright'}
                      onChange={(e) => setUsageCondition(e.target.value)}
                    />
                    <span>CC0(저작권없음)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="usageCondition"
                      value="ofl"
                      checked={usageCondition === 'ofl'}
                      onChange={(e) => setUsageCondition(e.target.value)}
                    />
                    <span>OFL(오픈폰트)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 공개여부 */}
            <div className="form-row">
              <label className="form-label">공개여부</label>
              <div className="form-control">
                <div className="radio-group vertical">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="publicStatus"
                      value="public"
                      checked={publicStatus === 'public'}
                      onChange={(e) => setPublicStatus(e.target.value)}
                    />
                    <span>공개 (모든 사용자가 콘텐츠를 볼 수 있습니다)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="publicStatus"
                      value="private"
                      checked={publicStatus === 'private'}
                      onChange={(e) => setPublicStatus(e.target.value)}
                    />
                    <span>비공개 (본인 및 채널 멤버만 콘텐츠를 볼 수 있습니다)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 보관함/채널 */}
            <div className="form-row">
              <label className="form-label">보관함/채널</label>
              <div className="form-control">
                <div className="radio-group vertical">
                  <div className="radio-with-sub">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="storageType"
                        value="channel"
                        checked={storageType === 'channel'}
                        onChange={(e) => setStorageType(e.target.value)}
                      />
                      <span>채널에 저장</span>
                    </label>
                    {storageType === 'channel' && (
                      <div className="sub-controls">
                        <select className="select-field" value={channelId} onChange={(e) => setChannelId(e.target.value)}>
                          <option value="">채널 선택</option>
                          <option value="channel1">채널 1</option>
                          <option value="channel2">채널 2</option>
                          <option value="channel3">채널 3</option>
                        </select>
                        <select className="select-field" value={folderPath} onChange={(e) => setFolderPath(e.target.value)}>
                          <option value="">하위 분류</option>
                          <option value="sub1">하위 분류 1</option>
                          <option value="sub2">하위 분류 2</option>
                          <option value="sub3">하위 분류 3</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="radio-with-sub">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="storageType"
                        value="storage"
                        checked={storageType === 'storage'}
                        onChange={(e) => setStorageType(e.target.value)}
                      />
                      <span>보관함에 저장</span>
                    </label>
                    {storageType === 'storage' && (
                      <div className="sub-controls">
                        <select className="select-field">
                          <option value="">폴더분류</option>
                          <option value="folder1">폴더 1</option>
                          <option value="folder2">폴더 2</option>
                          <option value="folder3">폴더 3</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="notice-box">
              <p>· 파일 한 개당 허용 최대 크기는 500MB입니다. (영상은 가능 하면 360p~720p)</p>
              <p>· 동영상 파일 콘텐츠 시 잇다(ITDA) 서비스 사용자에 맞게 자막 생성을 권장 합니다.</p>
            </div>

            {/* 확인 문구 */}
            <div className="confirmation-text">
              <p>등록 콘텐츠에 저작권 사용 문제가 없음을 확인합니다.</p>
            </div>

            {/* 버튼 */}
            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="btn btn-outline btn-large">
                취소
              </button>
              <button type="submit" className="btn btn-pink btn-large">
                등록
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
