import './UserProfile.css';
import type { UserInfo } from '../../types';
import { handleImageError, DEFAULT_PROFILE_SVG } from '../../utils/imageUtils';

interface UserProfileProps {
  userInfo: UserInfo;
}

export const UserProfile = ({ userInfo }: UserProfileProps) => {
  return (
    <section className="tea-information">
      <div className="tea-profile">
        <button className="profile-img default" style={{ cursor: 'default' }}>
          <img
            src={userInfo.profileImage || DEFAULT_PROFILE_SVG}
            alt="계정 프로필"
            onError={(e) => handleImageError(e, DEFAULT_PROFILE_SVG)}
          />
        </button>

        <div className="tea-center-info">
          <div className="tea-info">
            <span className="name">
              <b>{userInfo.nickname}</b>
              <div className="tea-edit">
                <span>선생님</span>
                <button className="btn-nicknameset" onClick={() => alert('별명 설정 기능')} />
              </div>
            </span>
            <span className="agency">
              <img
                src="/asset2/user/images/main/icon_school.svg"
                alt="소속 아이콘"
                title="소속 설정"
                style={{ marginRight: '4px' }}
              />
              {userInfo.school}
              <img
                src="/asset2/user/images/main/icon_place.svg"
                alt="위치 아이콘"
                title="위치 설정"
                style={{ marginLeft: '10px', marginRight: '4px' }}
              />
              {userInfo.location}
            </span>
          </div>

          <div className="tea-member">
            <ul>
              <li>
                <span className="num">
                  쪽지
                  <a href="/nte/receive/list.do">
                    <i>{userInfo.messageCount}</i>
                  </a>
                </span>
              </li>
              <li>
                <span className="num">
                  채널 초대
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('채널 초대 목록'); }}>
                    <i>{userInfo.channelInviteCount}</i>
                  </a>
                </span>
              </li>
            </ul>
            <ul style={{ marginTop: '4px' }}>
              <li>
                <span className="num">
                  팔로워
                  <a href="/lok/flw/followerList.do">
                    <i>{userInfo.followerCount}</i>
                  </a>
                </span>
              </li>
              <li>
                <span className="num">
                  팔로잉
                  <a href="/lok/flw/followingList.do">
                    <i>{userInfo.followingCount}</i>
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
