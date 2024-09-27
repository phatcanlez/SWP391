package com.example.SWP391.service;

import com.example.SWP391.entity.License;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LicenseService {
    @Autowired
    private LicenseRepository licenseRepository;

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

    public License updateLicense(License license, long Id){
        License oldLicense = licenseRepository.findLicenseById(Id);
        if(oldLicense == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldLicense.setName(license.getName());
            oldLicense.setType(license.getType());
            return licenseRepository.save(oldLicense);
        }catch (Exception e){
            throw new DuplicateException("This license ID already existed!! Try another one");
        }
    }


}
