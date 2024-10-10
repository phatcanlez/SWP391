package com.example.SWP391.service;


import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.PriceListDistanceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceListDistanceService {
    @Autowired
    private PriceListDistanceRepository priceListDistanceRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<PriceListDistance> getAllPriceDistance(){
        List<PriceListDistance> list = priceListDistanceRepository.findAll();
        return list;
    }

    public PriceListDistance createPriceDistance(PriceListDistance priceListDistance){
        try{
            return priceListDistanceRepository.save(priceListDistance);
        }catch (Exception e){
            throw new DuplicateException("This price distance is existed!!");
        }
    }

    public PriceListDistance viewPriceDistanceById(long id){
        PriceListDistance priceListDistance = priceListDistanceRepository.findPriceListDistanceByPriceListId(id);
        if(priceListDistance == null){
            throw new DuplicateException("Not found this price distance!!");
        }
        else{
            return priceListDistance;
        }
    }

    public PriceListDistance updatePriceDistance(PriceListDistance priceListDistance, long Id){
        PriceListDistance oldPriceDistance = priceListDistanceRepository.findPriceListDistanceByPriceListId(Id);
        if(oldPriceDistance == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldPriceDistance.setPrice(priceListDistance.getPrice());
            oldPriceDistance.setDistance(priceListDistance.getDistance());
             return priceListDistanceRepository.save(oldPriceDistance);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
