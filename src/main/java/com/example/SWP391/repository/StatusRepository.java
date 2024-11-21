package com.example.SWP391.repository;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import com.example.SWP391.model.Enum.StatusInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.lang.reflect.Array;
import java.util.List;

public interface StatusRepository extends JpaRepository<Status, Long> {
    Status findById(long id);
    List<Status> findByStatusInfo(StatusInfo statusInfo);

}
