+--------------------------------------------+
| Catalog Diff Report                        |
+--------------------------------------------+
Table `zeforis`.`orgs` was modified
  foreign keys:
  - removed foreign key: fk_user_org
  __
Table `zeforis`.`orgs` was modified
  indices:
  - added index fk_org_owner_idx with columns: owner_id
  - removed index owner_id_idx
  __
  foreign keys:
  - added foreign key fk_org_owner with columns: owner_id, referred table: users with columns: id
    - action on update: none
    - action on delete: CASCADE
  __
Table `zeforis`.`users` was modified
  columns:
  - added column plan of type VARCHAR(20)
  - added column stripe_customerId of type VARCHAR(30)
  - added column stripe_subscription_status of type VARCHAR(30)
  __
Routine `zeforis`.`getEngagementData` was created
Routine `zeforis`.`getUserData` was created
Routine `zeforis`.`test_sp` was created
----------------------------------------------
End of MySQL Workbench Report
