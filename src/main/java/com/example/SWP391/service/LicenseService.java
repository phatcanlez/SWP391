package com.example.SWP391.service;


import com.example.SWP391.entity.License;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeResponese;
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

    public License createLicense(License license){
        try{
            License newLicense = licenseRepository.save(license);
            return newLicense;
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

    public License updateLicense(License license, long Id){
        License oldLicense = licenseRepository.findLicenseById(Id);
        if(oldLicense == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldLicense.setName(license.getName());
            oldLicense.setType(license.getType());
            oldLicense.setDescription(license.getDescription());
            return licenseRepository.save(oldLicense);
        }catch (Exception e){
            throw new DuplicateException("Info is blank or Invalid description");
        }
    }


}
