
import React from "react";
import styled from "styled-components";

import { exists, roomCapacity, formatDate, escapeHtml } from "./helpers";
import { apiErrorToast, roomingSuccessToast } from "./toasts"
import { useModal } from "./modals/modals";
import RoomPropertiesModal from './modals/room_properties_modal';
import EnterLockedRoomModal from "./modals/enter_locked_room_modal";


const Members = ({beds, members}) => {
  const room_size = roomCapacity(beds);
  const people_in_room = members.length
  const free_capacity = room_size - people_in_room
  const tenants = [];
  React.useEffect(() => {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, {});
  })
  for (let i = 0; i < people_in_room; i++)
  {
    tenants.push(<i className="material-icons" key={i}> person </i>);
  }

  for (let i = 0; i < free_capacity; i++)
  {
    tenants.push(<i className="material-icons" key={i + people_in_room}> person_outline </i>);
  }

  return (
    <span className="right">
      {tenants}
    </span>
  )
}

const MemberList = ({members, users}) => {
  return (
    <span>
      {members.map(member => {
        const first_name = member.user.first_name;
        const last_name = member.user.last_name;
        return first_name + " " + last_name;
      }).join("; ")}
    </span>
  )
}

export const RoomCard = (props) => {
  const {room_ops} = props;

  const isAdmin = props.isAdminView;
  const isMyRoom = () => exists(props.members, ({user}) => props.me.id == user.id);
  const isFull = () => roomCapacity(props.available_beds) <= props.members.length;
  const isLocked = () => props.lock != null && new Date(props.lock.expiration_date) > new Date();

  const canEnter = () => !isAdmin && !isMyRoom() && !isFull();
  const canLeave = () => !isAdmin && isMyRoom();
  const canUnlock = () => !isAdmin && isLocked() && 'password' in props.lock && props.lock.password != null;
  const canLock = () => !isAdmin && !isLocked() && isMyRoom();

  const canDelete = () => isAdmin;
  const canEdit = () => isAdmin;

  const [openModal, closeModal] = useModal()

  const openEditModal = () =>
    openModal(RoomPropertiesModal, {
      data: props,
      closeModal,
      submit: data => room_ops.edit_room(props.id, data).then(
            roomingSuccessToast(room => "You've edited room " + escapeHtml(room.name) + "."),
            apiErrorToast
        )
    })

  const lockRoom = () => {
    room_ops.lock(props.id).then(
        roomingSuccessToast(room => "You've locked room " + escapeHtml(room.name) + " until " + formatDate(room.lock.expiration_date) + ".<br/>Send the room password to your friends."),
        apiErrorToast
    );
  }

  const unlockRoom = () => {
    room_ops.unlock(props.id).then(
        roomingSuccessToast(room => "You've unlocked room " + escapeHtml(room.name) + ".<br/>Now everybody can join the room."),
        apiErrorToast
    );
  }

  const enterRoom = () => {
    if (isLocked()) {
        openModal(EnterLockedRoomModal, {
            data: props,
            closeModal,
            submit: password => room_ops.join(props.id, password).then(
                roomingSuccessToast(room => "Password is correct!<br/>You've joined room " + escapeHtml(room.name) + "."),
                apiErrorToast
            )
        })
    } else {
        room_ops.join(props.id).then(
            roomingSuccessToast(room => "You've joined room " + escapeHtml(room.name)),
            apiErrorToast
        )
    }
  }

  const leaveRoom = () => {
    room_ops.leave(props.id).then(
        roomingSuccessToast(room => "You've left room " + escapeHtml(room.name) + ".<br/>The room would be unlocked if you locked it."),
        apiErrorToast
    );
  }

  const deleteRoom = () => {
    // TODO: Replace confirm with pretty modal window
    if (confirm("Are you sure you want to delete the room " + escapeHtml(props.name) + "?") == true) {
      room_ops.delete(props.id).then(
          roomingSuccessToast(room => "You've deleted room " + escapeHtml(props.name) + ".<br/>You should inform its inhabitants about this."),
          apiErrorToast
      );
    }
  }

  const card_class = () => {
    let cls = "card"
    if (props.hidden) {
      cls += " hidden"
    }
    if (isMyRoom()) {
      cls += " teal lighten-3"
    }
    else if (isFull()) {
      cls += " full"
    }
    else if (isLocked()) {
      cls += " locked"
    }
    return cls;
  }

  return (
    <div className={isMyRoom() ? "col s12" : "col s12 xl6"}>
      <div className={ card_class() }>
        <div className="card-content">
            <span className="card-title grey-text text-darken-4">
            <b> {isMyRoom() ? "Your room:" : "" } </b> {props.name}
            <Members
              beds={props.available_beds}
              members={props.members}
            />
            </span>
            <pre>{isLocked() ? (canUnlock() ? "Password: " + props.lock.password + "\n" : "") + "Locked until: " + formatDate(props.lock.expiration_date) : " "}</pre>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">{props.name}<i className="material-icons right">close</i></span>
          <p>
            Members: {props.members.length == 0 ? "-" : <MemberList users={props.users} members={props.members}/> } <br/>
            Beds: {props.available_beds.single} single, {props.available_beds.double} double <br/>
            Description: {props.description}
          </p>
        </div>
        <div className="card-action">
          { canEnter() ? <a href="#" onClick={enterRoom}> enter </a> : '' }
          { canLeave() ? <a href="#" onClick={leaveRoom}> leave </a> : '' }
          { canUnlock() ? <a href="#" onClick={unlockRoom}> unlock </a> : '' }
          { canLock() ? <a href="#" onClick={lockRoom}> lock </a> : '' }
          { canDelete() ? <a href="#" onClick={deleteRoom}> delete </a> : ''}
          { canEdit() ? <a href="#" onClick={openEditModal}> edit </a> : ""}
          <a></a>{ /* this empty a tag is needed to fix visual problem when room is full */ }
          <a href="javascript:void(0)" className="activator right" style={{"marginRight": 0}}> more </a>
        </div>
      </div>
    </div>
  )
}
