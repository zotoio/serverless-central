package com.serverless;

import java.lang.reflect.*;
import java.lang.annotation.*;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="samplejava")
public class Balance {
    private String id;
    private String balance;

    @DynamoDBHashKey(attributeName = "id")
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    @DynamoDBAttribute(attributeName="balance")
    public String getBalance() { return balance; }
    public void setBalance(String balance) { this.balance = balance; }

}
