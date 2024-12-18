package com.example.SWP391.service;


import com.example.SWP391.entity.License;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.License.DTO.LicenseRequest;
import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.repository.LicenseRepository;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.util.DateConversionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LicenseService {
    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<License> getAllLicense(){
        List<License> list = licenseRepository.findAll();
        return list;
    }

    public License createLicense(LicenseRequest license){
        try{
            License newLicense = modelMapper.map(license, License.class);
            newLicense.setOrders(orderRepository.findByorderID(license.getOrder()));
            newLicense.setDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
            return licenseRepository.save(newLicense);
        }catch (Exception e){
            throw new DuplicateException(e.getMessage());
        }
    }

    public void createLicenseFromJson(String jsonString) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<LicenseRequest> list = objectMapper.readValue(jsonString, objectMapper.getTypeFactory().constructCollectionType(List.class, LicenseRequest.class));

            for (LicenseRequest license : list) {
                License newLicense = modelMapper.map(license, License.class);
                newLicense.setOrders(orderRepository.findByorderID(license.getOrder()));
                newLicense.setDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
                licenseRepository.save(newLicense);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create license from JSON string", e);
        }
    }

    public License viewLicenseById(long id){
        License license = licenseRepository.findLicenseById(id);
        if(license == null){
            throw new DuplicateException("Not found this license");
        }
        else{
            return license;
        }
    }

    public List<License> viewLicenseByOrderId(String id){
        List<License> license = licenseRepository.findLicenseByOrdersOrderID(id);
        if(license == null){
            throw new DuplicateException("Not found this license");
        }
        else{
            return license;
        }
    }

    public License updateLicense(LicenseRequest license, long Id){
        License oldLicense = licenseRepository.findLicenseById(Id);
        if(oldLicense == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldLicense.setName(license.getName());
            oldLicense.setDescription(license.getDescription());
            oldLicense.setPriceOfKoi(license.getPriceOfKoi());
            oldLicense.setImgLicense(license.getImgLicense());
            oldLicense.setImgKoi(license.getImgKoi());
            oldLicense.setWeight(license.getWeight());
            oldLicense.setSize(license.getSize());
            return licenseRepository.save(oldLicense);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }



}
