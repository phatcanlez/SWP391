package com.example.SWP391.repository;


import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface RoomRepository extends JpaRepository<Room, Integer> {

    List<Room> findRoomsByUsersIsContaining(Account user);
    Room findRoomByUsersIsContainingAndUsersIsContaining(Account user1, Account user2);
    Room findRoomByRoomID(int roomID);
}
