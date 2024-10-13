package com.example.SWP391.service;


import com.example.SWP391.entity.ExtraService;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.ExtraServiceDTO.ExtraServiceRequest;
import com.example.SWP391.repository.ExtraServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExtraServiceService {
    @Autowired
    private ExtraServiceRepository extraServiceRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<ExtraService> getAllExtraService(){
        List<ExtraService> list = extraServiceRepository.findAll();
        return list;
    }

    public ExtraService createExtraService(ExtraServiceRequest extraService){
        try{
            ExtraService newExtraService = modelMapper.map(extraService, ExtraService.class);
            return extraServiceRepository.save(newExtraService);
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

    public ExtraService updateExtraService(ExtraServiceRequest extraService, long Id){
        ExtraService oldExtraService = extraServiceRepository.findExtraServiceByExtraServiceId(Id);
        if(oldExtraService == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldExtraService.setNameService(extraService.getNameService());
            oldExtraService.setPrice(extraService.getPrice());
            return extraServiceRepository.save(oldExtraService);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
