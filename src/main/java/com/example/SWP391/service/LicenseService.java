package com.example.SWP391.service;

import com.example.SWP391.entity.License;
import com.example.SWP391.repository.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

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
            throw new DuplicateEntity("This license is existed!!");
        }
    }

    public License updateLicense(License license, long Id){
        License oldLicense = licenseRepository.findLicenseById(Id);
        if(oldLicense == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldLicense.setLicenseId(license.getLicenseId());
            oldLicense.setLicenseName(license.getLicenseName());
            oldLicense.setLicenseType(license.getLicenseType());
            return licenseRepository.save(oldLicense);
        }catch (Exception e){
            throw new DuplicateEntity("This license ID already existed!! Try another one");
        }
    }


}
