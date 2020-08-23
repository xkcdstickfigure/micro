import axios from "axios";

let staff = [];
export default (id) => staff.includes(id);

axios
  .get(process.env.STAFF_LIST)
  .then((res) => {
    staff = res.data.split("\n").filter((u) => !!u);
  })
  .catch(() => {});
