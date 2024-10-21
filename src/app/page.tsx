import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <p>Home</p>
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
      <Link href={"/login"}>
        <Button>Login</Button>
      </Link>
      <Link href={"/signup"}>
        <Button>Signup</Button>
      </Link>
    </div>
  );
}
