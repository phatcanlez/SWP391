package com.example.SWP391.service;


import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Message;
import com.example.SWP391.entity.Room;
import com.example.SWP391.model.DTO.chatDTO.GetRoomRequest;
import com.example.SWP391.model.DTO.chatDTO.MessageRequest;
import com.example.SWP391.model.DTO.chatDTO.RoomRequest;
import com.example.SWP391.repository.AccountRepository;
import com.example.SWP391.repository.MessageRepository;
import com.example.SWP391.repository.RoomRepository;
import com.example.SWP391.util.AccountUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final MessageRepository messageRepository;
    private final AccountRepository userRepository;
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AccountUtils accountUtils;

    public Room createNewRoom(RoomRequest roomRequest) {
        Set<Account> users = new HashSet<>();
        Account user1 = userRepository.findAccountById(roomRequest.getMembers().get(0));
        Account user2 = userRepository.findAccountById(roomRequest.getMembers().get(1));
        Room roomCheck = roomRepository.findRoomByUsersIsContainingAndUsersIsContaining(user1, user2);
        if (roomCheck != null) return roomCheck;

        Room room = new Room();
        room.setUsers(users);
        for (String accountId : roomRequest.getMembers()) {
            try {
                Account user = userRepository.findAccountById(accountId);
                user.getRooms().add(room);
                users.add(user);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return roomRepository.save(room);
    }

    public Room getRoomByStaffAndCustomer(String staffID, String customerID) {
        Account staff = userRepository.findAccountById(staffID);
        Account customer = userRepository.findAccountById(customerID);

        if (staff != null && customer != null) {
            // Try to find a room that contains both users
            return roomRepository.findRoomByUsersIsContainingAndUsersIsContaining(staff, customer);
        }
        return null;  // Return null if either user doesn't exist
    }

    public List<Room> getRoomsByAccountID() {
        Account user = accountUtils.getCurrentUser();
        List<Room> rooms = roomRepository.findRoomsByUsersIsContaining(user);
        if (rooms != null) {
            return rooms.stream().sorted(Comparator.comparing(Room::getLastUpdated).reversed()).collect(Collectors.toList());
        }
        return null;
    }

    public Room getRoomDetail(int roomID) {
        Room roomDTO = roomRepository.findRoomByRoomID(roomID);
        if (roomDTO != null)
            roomDTO.setMessages(roomDTO.getMessages().stream().sorted(Comparator.comparing(Message::getCreateAt)).collect(Collectors.toList()));
        return roomDTO;
    }

    public Message sendMessage(MessageRequest messageRequest, int roomId) {
        Account user = accountUtils.getCurrentUser();
        Room roomDTO = roomRepository.findRoomByRoomID(roomId);
        Message messageDTO = new Message();
        messageDTO.setUser(user);
        messageDTO.setRoom(roomDTO);
        messageDTO.setMessage(messageRequest.getMessage());
        roomDTO.setLastUpdated(new Date());
        roomDTO.setLastMessage(messageRequest.getMessage());
        roomRepository.save(roomDTO);
        for (Account user1 : roomDTO.getUsers()) {
            if (!user1.getId().equals(user.getId())) {
                System.out.println("real time");
                System.out.println(user1.getId());
                messagingTemplate.convertAndSend("/topic/chat/" + user1.getId(), "New message");
            }
        }
        return messageRepository.save(messageDTO);
    }

    public void setTyping(int roomID, String name) {
        Room roomDTO = roomRepository.findRoomByRoomID(roomID);
        for (Account account : roomDTO.getUsers()) {
            messagingTemplate.convertAndSend("/topic/chat/" + account.getId(), name + " is typing ... ");
        }
    }

    public Room getRoom(GetRoomRequest getRoomRequest) {
        Account user1 = userRepository.findAccountById(getRoomRequest.getUser1());
        Account user2 = userRepository.findAccountById(getRoomRequest.getUser2());

        Set<Account> accountDTOS = new HashSet<>();
        accountDTOS.add(user1);
        accountDTOS.add(user2);

        Room room = roomRepository.findRoomByUsersIsContainingAndUsersIsContaining(user1, user2);
        if (room == null) {
            room = new Room();
            room.setUsers(accountDTOS);
            room.setName("[" + user1.getName() + " and " + user2.getName() + "]");
            room = roomRepository.save(room);
        }

        return room;
    }


}
