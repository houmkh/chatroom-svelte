<script>

function show_users() {
        let url = "/api/user/show_users";
      
            fetch(url, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
                
            })
            // .then(console.log);
        
        }
    }
</script>