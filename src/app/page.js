
import Link from 'next/link';
import Button from '@/components/ui/Button/Button.jsx';

export default function Home() {
  return (
    <div className="flex gap-2 flex-wrap">
    <Button variant="filled-black">filled-black</Button>
    <Button variant="filled-white">filled-white</Button>
    <Button variant="warning">Warning</Button>
    <Button variant="success">Success</Button>
    
    
  </div>
  );
}