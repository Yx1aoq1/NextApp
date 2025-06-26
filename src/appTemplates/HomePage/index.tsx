import { Link } from '@/i18n/navigation';

export const HomePage = () => {
  return (
    <div>
      <h1>测试链接</h1>
      <ul>
        <Link href="/video">
          <li>/video</li>
        </Link>
      </ul>
    </div>
  );
};
