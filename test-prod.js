import { connect } from "./dist/server/connect.js";
async function run() {
  try {
    const res = await connect({
      privateKey: "0x3c05ac1a00546bc0b1b8d3a11fb908409005fac3f26d25f70711e4f632e720d3",
      scopes: ["linkedin.profile"],
      environment: "prod"
    });
    console.log("Success:", res);
  } catch (err) {
    console.log("Error:", err);
  }
}
run();
