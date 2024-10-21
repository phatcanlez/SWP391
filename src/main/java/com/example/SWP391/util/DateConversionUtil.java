package com.example.SWP391.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class DateConversionUtil {
    public static Date convertToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
}