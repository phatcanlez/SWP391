package com.example.SWP391.service;


import com.example.SWP391.entity.License;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.License.DTO.LicenseRequest;
import com.example.SWP391.repository.LicenseRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LicenseService {
    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<License> getAllLicense(){
        List<License> list = licenseRepository.findAll();
        return list;
    }

    public License createLicense(LicenseRequest license){
        try{
            License newLicense = modelMapper.map(license, License.class);
            return licenseRepository.save(newLicense);
        }catch (Exception e){
            throw new DuplicateException("This license is existed!!");
        }
    }

    public License viewEmployeeById(long id){
        License license = licenseRepository.findLicenseById(id);
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
            oldLicense.setNameOfLicense(license.getName());
            oldLicense.setTypeOfLicense(license.getType());
            oldLicense.setDescription(license.getDescription());
            return licenseRepository.save(oldLicense);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }



}
