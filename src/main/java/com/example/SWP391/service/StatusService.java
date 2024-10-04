package com.example.SWP391.service;

import com.example.SWP391.entity.Status;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusService {
    @Autowired
    StatusRepository statusRepository;

    public Status createStatus(Status status){
        try{
            return statusRepository.save(status);
        }catch (Exception e){
            throw new DuplicateException("This status is existed!!");
        }
    }

    public List<Status> getAllStatus(){
        List<Status> list = statusRepository.findAll();
        return list;
    }

    public Status viewStatusById(long id){
        Status status = statusRepository.findById(id);
        if(status == null){
            throw new DuplicateException("Not found this status");
        }
        else{
            return status;
        }
    }

    public Status updateStatus(Status status, long Id){
        Status oldStatus = statusRepository.findById(Id);
        if(oldStatus == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldStatus.setStatusInfo(status.getStatusInfo());
            oldStatus.setDate(status.getDate());
            oldStatus.setDescription(status.getDescription());
            return statusRepository.save(oldStatus);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }
}
