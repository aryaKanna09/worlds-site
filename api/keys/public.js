import { withErrors } from "../_lib/db.js";
import { publicKeyPem } from "../_lib/sign.js";

export default withErrors(async (req, res) => {
  const pem = publicKeyPem();
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(pem);
});
