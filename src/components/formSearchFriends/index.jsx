import { IoClose } from "react-icons/io5";
import { useStateValue } from "../../Context/StateProvider";
import "./index.scss";
import RoomMessage from "../roomMessage";

function FormSearchFriends() {
  const { setShowSearchFriends, active, setActive } = useStateValue();

  return (
    <>
      <div className="searchFriends">
        <div className="formSearch">
          <div className="formSearch__header">
            <div style={{ width: "30px" }}></div>
            <h3>New Message</h3>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setShowSearchFriends(false)}
            >
              <IoClose fontSize={"30px"} />
            </div>
          </div>
          <div className="formSearch__input">
            <h5>Arrive: </h5>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="formSearch__friends">
            <RoomMessage
              room={1}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf uaysgd ausgyd auysgd aysgdai sd yiag diag diasgdidia gdiagdiasgdi gi"
            />
            <RoomMessage
              room={2}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf "
            />{" "}
            <RoomMessage
              room={3}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf uaysgd ausgyd auysgd aysgdai sd yiag diag diasgdidia gdiagdiasgdi gi"
            />
            <RoomMessage
              room={4}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf "
            />{" "}
            <RoomMessage
              room={5}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf uaysgd ausgyd auysgd aysgdai sd yiag diag diasgdidia gdiagdiasgdi gi"
            />
            <RoomMessage
              room={6}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf "
            />{" "}
            <RoomMessage
              room={7}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf uaysgd ausgyd auysgd aysgdai sd yiag diag diasgdidia gdiagdiasgdi gi"
            />
            <RoomMessage
              room={8}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf "
            />{" "}
            <RoomMessage
              room={9}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf uaysgd ausgyd auysgd aysgdai sd yiag diag diasgdidia gdiagdiasgdi gi"
            />
            <RoomMessage
              room={10}
              active={active}
              setActive={setActive}
              avt="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-vo-tri-91.jpg"
              name="Đỗ Minh"
              lastMessage="lorem sadas asdosw s aos sad vpssanf "
            />
          </div>
        </div>
      </div>
      <div
        className="overlay"
        onClick={() => setShowSearchFriends(false)}
      ></div>
    </>
  );
}

export default FormSearchFriends;
