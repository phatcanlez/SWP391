package com.example.SWP391.service;


import com.example.SWP391.entity.BoxPrice;

import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.BoxPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoxPriceService {
    @Autowired
    private BoxPriceRepository boxPriceRepository;


    public List<BoxPrice> getAllBoxPrice(){
        List<BoxPrice> list = boxPriceRepository.findAll();
        return list;
    }

    public BoxPrice createBoxPrice(BoxPrice boxPrice){
        try{
            return boxPriceRepository.save(boxPrice);
        }catch (Exception e){
            throw new DuplicateException("This box price is existed!!");
        }
    }

    public BoxPrice viewBoxPriceById(long id){
        BoxPrice boxPrice = boxPriceRepository.findBoxPriceByBoxId(id);
        if(boxPrice == null){
            throw new DuplicateException("Not found this boxPrice");
        }
        else{
            return boxPrice;
        }
    }

    public BoxPrice updateBoxPrice(BoxPrice boxPrice, long Id){
        BoxPrice oldBoxPrice = boxPriceRepository.findBoxPriceByBoxId(Id);
        if(oldBoxPrice == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldBoxPrice.setPrice(boxPrice.getPrice());
            oldBoxPrice.setSurcharge(boxPrice.getSurcharge());
            return boxPriceRepository.save(oldBoxPrice);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
