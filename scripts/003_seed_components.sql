-- Seed components data

-- CPUs
insert into public.components (category, name, brand, price, specs, image_url) values
  ('CPU', 'AMD Ryzen 9 7950X', 'AMD', 549.99, '{"socket":"AM5","cores":16,"threads":32,"boost_clock":"5.7GHz"}', null),
  ('CPU', 'AMD Ryzen 7 7700X', 'AMD', 299.99, '{"socket":"AM5","cores":8,"threads":16,"boost_clock":"5.4GHz"}', null),
  ('CPU', 'AMD Ryzen 5 7600X', 'AMD', 199.99, '{"socket":"AM5","cores":6,"threads":12,"boost_clock":"5.3GHz"}', null),
  ('CPU', 'Intel Core i9-14900K', 'Intel', 579.99, '{"socket":"LGA1700","cores":24,"threads":32,"boost_clock":"6.0GHz"}', null),
  ('CPU', 'Intel Core i7-14700K', 'Intel', 369.99, '{"socket":"LGA1700","cores":20,"threads":28,"boost_clock":"5.6GHz"}', null),
  ('CPU', 'Intel Core i5-14600K', 'Intel', 249.99, '{"socket":"LGA1700","cores":14,"threads":20,"boost_clock":"5.3GHz"}', null)
on conflict do nothing;

-- Motherboards
insert into public.components (category, name, brand, price, specs, image_url) values
  ('Motherboard', 'ASUS ROG Crosshair X670E Hero', 'ASUS', 699.99, '{"socket":"AM5","form_factor":"ATX","chipset":"X670E"}', null),
  ('Motherboard', 'MSI MAG B650 Tomahawk', 'MSI', 219.99, '{"socket":"AM5","form_factor":"ATX","chipset":"B650"}', null),
  ('Motherboard', 'Gigabyte B650 Aorus Elite AX', 'Gigabyte', 189.99, '{"socket":"AM5","form_factor":"ATX","chipset":"B650"}', null),
  ('Motherboard', 'ASUS ROG Maximus Z790 Hero', 'ASUS', 629.99, '{"socket":"LGA1700","form_factor":"ATX","chipset":"Z790"}', null),
  ('Motherboard', 'MSI MAG Z790 Tomahawk', 'MSI', 279.99, '{"socket":"LGA1700","form_factor":"ATX","chipset":"Z790"}', null),
  ('Motherboard', 'Gigabyte Z790 Aorus Elite AX', 'Gigabyte', 249.99, '{"socket":"LGA1700","form_factor":"ATX","chipset":"Z790"}', null)
on conflict do nothing;

-- GPUs
insert into public.components (category, name, brand, price, specs, image_url) values
  ('GPU', 'NVIDIA RTX 4090', 'NVIDIA', 1599.99, '{"memory":"24GB GDDR6X","recommended_psu":"1000W"}', null),
  ('GPU', 'NVIDIA RTX 4080 Super', 'NVIDIA', 999.99, '{"memory":"16GB GDDR6X","recommended_psu":"850W"}', null),
  ('GPU', 'NVIDIA RTX 4070 Ti Super', 'NVIDIA', 799.99, '{"memory":"16GB GDDR6X","recommended_psu":"750W"}', null),
  ('GPU', 'AMD Radeon RX 7900 XTX', 'AMD', 949.99, '{"memory":"24GB GDDR6","recommended_psu":"850W"}', null),
  ('GPU', 'AMD Radeon RX 7800 XT', 'AMD', 499.99, '{"memory":"16GB GDDR6","recommended_psu":"700W"}', null),
  ('GPU', 'NVIDIA RTX 4060 Ti', 'NVIDIA', 399.99, '{"memory":"8GB GDDR6","recommended_psu":"550W"}', null)
on conflict do nothing;

-- RAM
insert into public.components (category, name, brand, price, specs, image_url) values
  ('RAM', 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 'Corsair', 109.99, '{"capacity_gb":32,"speed_mhz":6000,"type":"DDR5"}', null),
  ('RAM', 'G.Skill Trident Z5 DDR5 32GB (2x16GB) 6400MHz', 'G.Skill', 134.99, '{"capacity_gb":32,"speed_mhz":6400,"type":"DDR5"}', null),
  ('RAM', 'Kingston Fury Beast DDR5 32GB (2x16GB) 5600MHz', 'Kingston', 89.99, '{"capacity_gb":32,"speed_mhz":5600,"type":"DDR5"}', null),
  ('RAM', 'Corsair Vengeance DDR5 64GB (2x32GB) 6000MHz', 'Corsair', 199.99, '{"capacity_gb":64,"speed_mhz":6000,"type":"DDR5"}', null),
  ('RAM', 'G.Skill Trident Z5 RGB DDR5 64GB (2x32GB) 6000MHz', 'G.Skill', 229.99, '{"capacity_gb":64,"speed_mhz":6000,"type":"DDR5","rgb":true}', null)
on conflict do nothing;

-- Storage
insert into public.components (category, name, brand, price, specs, image_url) values
  ('Storage', 'Samsung 990 Pro 2TB NVMe SSD', 'Samsung', 169.99, '{"capacity_tb":2,"type":"NVMe SSD","interface":"PCIe 4.0"}', null),
  ('Storage', 'Samsung 990 Pro 1TB NVMe SSD', 'Samsung', 109.99, '{"capacity_tb":1,"type":"NVMe SSD","interface":"PCIe 4.0"}', null),
  ('Storage', 'WD Black SN850X 2TB NVMe SSD', 'Western Digital', 149.99, '{"capacity_tb":2,"type":"NVMe SSD","interface":"PCIe 4.0"}', null),
  ('Storage', 'WD Black SN850X 1TB NVMe SSD', 'Western Digital', 89.99, '{"capacity_tb":1,"type":"NVMe SSD","interface":"PCIe 4.0"}', null),
  ('Storage', 'Crucial T700 2TB NVMe SSD', 'Crucial', 219.99, '{"capacity_tb":2,"type":"NVMe SSD","interface":"PCIe 5.0"}', null),
  ('Storage', 'Seagate FireCuda 530 1TB NVMe SSD', 'Seagate', 99.99, '{"capacity_tb":1,"type":"NVMe SSD","interface":"PCIe 4.0"}', null)
on conflict do nothing;
