// middleware.ts (o .js) nella root del progetto
export { default } from "next-auth/middleware";

export const config = {
matcher: ["/dashboard/:path*", "/utenze/:path*"],
};
