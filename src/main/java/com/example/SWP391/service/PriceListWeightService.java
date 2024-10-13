package com.example.SWP391.service;


import com.example.SWP391.entity.PriceListWeight;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.PriceListWeightRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceListWeightService {
    @Autowired
    private PriceListWeightRepository priceListWeightRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<PriceListWeight> getAllPriceWeight(){
        List<PriceListWeight> list = priceListWeightRepository.findAll();
        return list;
    }

    public PriceListWeight createPriceWeight(PriceListWeight priceListWeight){
        try{
            return priceListWeightRepository.save(priceListWeight);
        }catch (Exception e){
            throw new DuplicateException("This price weight is existed!!");
        }
    }

    public PriceListWeight viewPriceWeightById(long id){
        PriceListWeight priceListWeight = priceListWeightRepository.findPriceListWeightByPriceListId(id);
        if(priceListWeight == null){
            throw new DuplicateException("Not found this price weight");
        }
        else{
            return priceListWeight;
        }
    }

    public PriceListWeight updatePriceWeight(PriceListWeight priceListWeight, long Id){
        PriceListWeight oldPriceWeight = priceListWeightRepository.findPriceListWeightByPriceListId(Id);
        if(oldPriceWeight == null){
            throw new NotFoundException("Not found!");
        }
        try{
             oldPriceWeight.setPrice(priceListWeight.getPrice());
             oldPriceWeight.setWeight(priceListWeight.getWeight());
             return priceListWeightRepository.save(oldPriceWeight);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
