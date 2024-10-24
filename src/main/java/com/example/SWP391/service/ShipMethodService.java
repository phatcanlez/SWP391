package com.example.SWP391.service;



import com.example.SWP391.entity.ShipMethod;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.ShipMethodRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ShipMethodService {
    @Autowired
    private ShipMethodRepository shipMethodRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<ShipMethod> getAllShipMethod(){
        List<ShipMethod> list = shipMethodRepository.findAll();
        return list;
    }

    public ShipMethod createShipMethod(ShipMethod shipMethod){
        try{
            return shipMethodRepository.save(shipMethod);
        }catch (Exception e){
            throw new DuplicateException("This ship method is existed!!");
        }
    }

    public ShipMethod viewShipMethodById(long id){
        ShipMethod shipMethod = shipMethodRepository.findShipMethodByShipMethodId(id);
        if(shipMethod == null){
            throw new DuplicateException("Not found this payment");
        }
        else{
            return shipMethod;
        }
    }

    public ShipMethod updateShipMethod(ShipMethod shipMethod, long Id){
        ShipMethod oldShipMethod = shipMethodRepository.findShipMethodByShipMethodId(Id);
        if(oldShipMethod== null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldShipMethod.setDescription(shipMethod.getDescription());
            return shipMethodRepository.save(oldShipMethod);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
