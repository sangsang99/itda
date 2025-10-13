import './MyStorage.css';
import type { MyStorage as MyStorageType } from '../../types';

interface MyStorageProps {
  storage: MyStorageType;
}

export const MyStorage = ({ storage }: MyStorageProps) => {
  const storageItems = [
    { name: '꾸러미', link: '/lok/pack/list.do', count: storage.packageCount },
    { name: '콘텐츠', link: '/lok/cts/list.do', count: storage.contentsCount },
    { name: '문항', link: '/lok/qes/list.do', count: storage.questionCount },
    { name: '시험지', link: '/lok/expr/list.do', count: storage.examCount },
    { name: '공유', link: '/lok/sha/list.do', count: storage.sharedCount },
  ];

  return (
    <section className="tea-items">
      <div className="inbox">
        <div className="tit-area">
          <div className="title">
            <span>내 보관함</span>
            <ul className="volume-list">
              <li>
                <button className="on" onClick={() => window.open('/lok/setting/lokStatus.do', '_blank')}>
                  {storage.usedSpace}
                </button>
              </li>
              <li>
                <button onClick={() => window.open('/lok/setting/lokStatus.do', '_blank')}>
                  {storage.totalSpace}
                </button>
              </li>
            </ul>
          </div>
          <span className="num">
            자료 총 <i>{storage.totalCount}</i>건
          </span>
        </div>

        <ul className="inbox-list">
          {storageItems.map((item) => (
            <li key={item.name}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <i />
                {item.name}
                <span className="num">
                  <i>{item.count}</i>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
