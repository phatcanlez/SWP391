package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.model.DTO.ScheduleDTO.DistanceAndEmp;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class APIService {
    @Autowired
    private RestTemplate restTemplate;

    private static final String API_URL ="https://www.mapquestapi.com/directions/v2/routematrix?key=q2nZLaYsfNSKkjKB3ovJuaTnAwK3KX3i"; // MapQuest cho phép tối đa 25 locations trong 1 lần gọi
    private static final int KILOMETER_LIMIT = 150;

    public JsonNode getRouteMatrix(List<String> locations) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        StringBuilder locationsJson = new StringBuilder();
        for (String location : locations) {
            locationsJson.append("\"").append(location).append("\",");
        }
        // Remove the trailing comma
        if (locationsJson.length() > 0) {
            locationsJson.setLength(locationsJson.length() - 1);
        }

        String requestBody = """
            {
                 "locations": [
                     %s
                 ],
                 "options":{
                 "manyToOne": true
                 }
            }
            """.formatted(locationsJson.toString());

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        String response = restTemplate.postForObject(API_URL, request, String.class);

        try {
            return extractDistance(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private JsonNode extractDistance(String jsonResponse) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode distanceNode = rootNode.path("distance");
        System.out.println(distanceNode);
        return distanceNode;
    }

    public void processBatch(List<Account> batch, List<DistanceAndEmp> listDisEmp, String orderAddress) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo danh sách locations cho batch
        List<String> locations = new ArrayList<>();
        for (Account emp : batch) {
            String[] tmp = emp.getAddress().split(",");
            String address = tmp[tmp.length - 2].trim() + ", " + tmp[tmp.length - 1].trim();
            locations.add(address);
        }

        String requestBody = createRequestBody(locations, orderAddress);
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(API_URL, request, String.class);
            //lọc những nhân viên có khoảng cách nhỏ hơn theo yêu cầu
            processResponseDistance(response, batch, listDisEmp);

            // Thêm delay để tránh rate limit
            Thread.sleep(100);
        } catch (Exception e) {
            throw new RuntimeException("Error processing batch", e);
        }
    }

    private void processResponseDistance(String response, List<Account> batch, List<DistanceAndEmp> listDisEmp) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            JsonNode distanceNode = rootNode.path("distance");

            for (int i = 1; i < distanceNode.size(); i++) {
                double distance = distanceNode.get(i).asDouble();
                if (distance <= KILOMETER_LIMIT) {
                    DistanceAndEmp distanceAndEmp = new DistanceAndEmp();
                    distanceAndEmp.setEmp(batch.get(i - 1));
                    distanceAndEmp.setDistance(distanceNode.get(i).asDouble());
                    listDisEmp.add(distanceAndEmp);
                }
                System.out.println(distance);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing response", e);
        }
    }

    private String createRequestBody(List<String> locations, String orderAddress) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> requestMap = new HashMap<>();
        locations.addFirst(orderAddress);
        requestMap.put("locations", locations);
        requestMap.put("options", createOptions());

        try {
            return mapper.writeValueAsString(requestMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error creating request body", e);
        }
    }

    private Map<String, Object> createOptions() {
        Map<String, Object> options = new HashMap<>();
        options.put("manyToOne", true);
        // Thêm các options khác nếu cần
        return options;
    }
}
