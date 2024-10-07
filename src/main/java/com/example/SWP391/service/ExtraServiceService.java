package com.example.SWP391.service;


import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.entity.ExtraService;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.BoxPriceRepository;
import com.example.SWP391.repository.ExtraServiceRepository;
import org.modelmapper.ModelMapper;
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

    public ExtraService updateExtraService(ExtraService extraService, long Id){
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
