package com.example.SWP391.controller;


import com.example.SWP391.entity.Room;
import com.example.SWP391.model.DTO.chatDTO.GetRoomRequest;
import com.example.SWP391.model.DTO.chatDTO.MessageRequest;
import com.example.SWP391.model.DTO.chatDTO.RoomRequest;
import com.example.SWP391.service.ChatService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@SecurityRequirement(name = "api") //bắt buộc có, nên nhớ
@RequestMapping("api/chat")
public class ChatController {

    @Autowired
    ChatService chatService;

    @PostMapping()
    public ResponseEntity createNewChat(@RequestBody RoomRequest roomRequest) {
        Room room = chatService.createNewRoom(roomRequest);
        return ResponseEntity.ok(room);
    }
    @GetMapping("/room/{staffID}/{customerID}")
    public ResponseEntity getRoomByStaffAndCustomer(@PathVariable String staffID, @PathVariable String customerID) {
        Room room = chatService.getRoomByStaffAndCustomer(staffID, customerID);
        if (room != null) {
            return ResponseEntity.ok(room);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping()
    public ResponseEntity getChatByAccountID() {
        List<Room> rooms = chatService.getRoomsByAccountID();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/detail/{roomID}")
    public ResponseEntity getChatDetail(@PathVariable int roomID) {
        return ResponseEntity.ok(chatService.getRoomDetail(roomID));
    }

    @PostMapping("/send/{roomID}")
    public ResponseEntity sendMessage(@PathVariable int roomID, @RequestBody MessageRequest messageRequest) {
        return ResponseEntity.ok(chatService.sendMessage(messageRequest,roomID));
    }

    @PostMapping("/typing/{roomID}/{name}")
    public void typingMessage(@PathVariable int roomID, @PathVariable String name) {
        chatService.setTyping(roomID, name);
    }

    @PostMapping("/room")
    public ResponseEntity<Room> getRoom(@RequestBody GetRoomRequest getRoomRequest) {
        return ResponseEntity.ok(chatService.getRoom(getRoomRequest));
    }
}
