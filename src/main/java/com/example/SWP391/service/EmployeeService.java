package com.example.SWP391.service;

import com.example.SWP391.entity.Employee;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeRequest;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeRequestUpdate;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeResponese;
import com.example.SWP391.repository.EmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    public EmployeeResponese createEmployee (EmployeeRequest employRq) {
        try {
            employRq.setPassword(passwordEncoder.encode(employRq.getPassword()));
            Employee employ = modelMapper.map(employRq, Employee.class);
            EmployeeResponese employRp = modelMapper.map(employRq, EmployeeResponese.class);
            employeeRepository.save(employ);
            return employRp;
        } catch (Exception e) {
                throw new DuplicateException("Email or Phone is not valid");

        }
    }

    public EmployeeResponese viewEmployeeById(String id){
        Employee employee = employeeRepository.findEmployeeById(id);
        if(employee == null){
            throw new DuplicateException("Not found this employee");
        }
        else{
            EmployeeResponese employRp = modelMapper.map(employee, EmployeeResponese.class);
            return employRp;
        }
    }
//
    public List<EmployeeResponese> getEmployees(){
        List<Employee> list = employeeRepository.findAll();
        List<EmployeeResponese> list1 = new ArrayList<>();
        for(Employee i : list){
            EmployeeResponese e = modelMapper.map(i,EmployeeResponese.class);
            list1.add(e);
        }
        if(list == null){
            throw new DuplicateException("Not found");
        }
        return list1;
    }

    public EmployeeRequestUpdate updateAccount(EmployeeRequestUpdate employeeRequestUpdate, String id) {
        Employee oldEmploy = employeeRepository.findEmployeeById(id);
          if (oldEmploy == null)
              throw new DuplicateException("Not found");
        try {
            oldEmploy.setPassword(employeeRequestUpdate.getPassword());
            oldEmploy.setAvatar(employeeRequestUpdate.getAvatar());
            oldEmploy.setName(employeeRequestUpdate.getName());
            oldEmploy.setPhoneNumber(employeeRequestUpdate.getPhoneNumber());
            oldEmploy.setStatus(employeeRequestUpdate.getStatus());
            employeeRepository.save(oldEmploy);
            return employeeRequestUpdate;
      } catch (Exception e) {
          throw new DuplicateException("Invalid info or this account is already exist");
      }

    }
    }

