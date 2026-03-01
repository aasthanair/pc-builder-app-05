-- Seed components data
-- CPUs
insert into public.components (name, type, price, socket_type) values
  ('AMD Ryzen 9 7950X', 'CPU', 549.99, 'AM5'),
  ('AMD Ryzen 7 7700X', 'CPU', 299.99, 'AM5'),
  ('AMD Ryzen 5 7600X', 'CPU', 199.99, 'AM5'),
  ('Intel Core i9-14900K', 'CPU', 579.99, 'LGA1700'),
  ('Intel Core i7-14700K', 'CPU', 369.99, 'LGA1700'),
  ('Intel Core i5-14600K', 'CPU', 249.99, 'LGA1700')
on conflict do nothing;

-- Motherboards
insert into public.components (name, type, price, socket_type) values
  ('ASUS ROG Crosshair X670E Hero', 'Motherboard', 699.99, 'AM5'),
  ('MSI MAG B650 Tomahawk', 'Motherboard', 219.99, 'AM5'),
  ('Gigabyte B650 Aorus Elite AX', 'Motherboard', 189.99, 'AM5'),
  ('ASUS ROG Maximus Z790 Hero', 'Motherboard', 629.99, 'LGA1700'),
  ('MSI MAG Z790 Tomahawk', 'Motherboard', 279.99, 'LGA1700'),
  ('Gigabyte Z790 Aorus Elite AX', 'Motherboard', 249.99, 'LGA1700')
on conflict do nothing;

-- GPUs (no socket type)
insert into public.components (name, type, price, socket_type) values
  ('NVIDIA RTX 4090', 'GPU', 1599.99, null),
  ('NVIDIA RTX 4080 Super', 'GPU', 999.99, null),
  ('NVIDIA RTX 4070 Ti Super', 'GPU', 799.99, null),
  ('AMD Radeon RX 7900 XTX', 'GPU', 949.99, null),
  ('AMD Radeon RX 7800 XT', 'GPU', 499.99, null),
  ('NVIDIA RTX 4060 Ti', 'GPU', 399.99, null)
on conflict do nothing;

-- RAM (no socket type)
insert into public.components (name, type, price, socket_type) values
  ('Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 'RAM', 109.99, null),
  ('G.Skill Trident Z5 DDR5 32GB (2x16GB) 6400MHz', 'RAM', 134.99, null),
  ('Kingston Fury Beast DDR5 32GB (2x16GB) 5600MHz', 'RAM', 89.99, null),
  ('Corsair Vengeance DDR5 64GB (2x32GB) 6000MHz', 'RAM', 199.99, null),
  ('G.Skill Trident Z5 RGB DDR5 64GB (2x32GB) 6000MHz', 'RAM', 229.99, null)
on conflict do nothing;

-- Storage (no socket type)
insert into public.components (name, type, price, socket_type) values
  ('Samsung 990 Pro 2TB NVMe SSD', 'Storage', 169.99, null),
  ('Samsung 990 Pro 1TB NVMe SSD', 'Storage', 109.99, null),
  ('WD Black SN850X 2TB NVMe SSD', 'Storage', 149.99, null),
  ('WD Black SN850X 1TB NVMe SSD', 'Storage', 89.99, null),
  ('Crucial T700 2TB NVMe SSD', 'Storage', 219.99, null),
  ('Seagate FireCuda 530 1TB NVMe SSD', 'Storage', 99.99, null)
on conflict do nothing;
