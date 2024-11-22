package com.example.SWP391.service;


import com.example.SWP391.entity.ExtraService;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.ResponseMessage;
import com.example.SWP391.repository.BoxPriceRepository;
import com.example.SWP391.repository.ExtraServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExtraServiceService {
    @Autowired
    private ExtraServiceRepository extraServiceRepository;

    public List<ExtraService> getAllExtraService(){
        List<ExtraService> list = extraServiceRepository.findAll();
        return list;
    }

    public ExtraService createExtraService(ExtraService extraService){
        try{
            return extraServiceRepository.save(extraService);
        }catch (Exception e){
            throw new DuplicateException("This extra service is existed!!");
        }
    }

    public ExtraService viewExtraServiceById(long id){
        ExtraService extraService = extraServiceRepository.findExtraServiceByExtraServiceId(id);
        if(extraService == null){
            throw new DuplicateException("Not found this extra service");
        }
        else{
            return extraService;
        }
    }

    public ExtraService updateExtraService(ExtraService extraService){
        ExtraService oldExtraService = extraServiceRepository.findExtraServiceByExtraServiceId(extraService.getExtraServiceId());
        if(oldExtraService == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldExtraService.setNameService(extraService.getNameService());
            oldExtraService.setPrice(extraService.getPrice());
            oldExtraService.setDescription(extraService.getDescription());
            return extraServiceRepository.save(oldExtraService);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


    public ResponseMessage deleteExtraService(long id) {
        ExtraService extraService = extraServiceRepository.findExtraServiceByExtraServiceId(id);
        if(extraService == null){
            throw new NotFoundException("Not found this extra service");
        }
        try{
            extraServiceRepository.delete(extraService);
            return new ResponseMessage("Delete successfully");
        }catch (Exception e){
            throw new DuplicateException("Delete fail");
        }
    }
}
