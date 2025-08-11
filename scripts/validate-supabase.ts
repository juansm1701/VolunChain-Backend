import { supabase } from '../src/config/supabase';

async function test() {
  const { data, error } = await supabase.from('test').select('*');
  if (error) throw error;
  console.log(data);
}

test();