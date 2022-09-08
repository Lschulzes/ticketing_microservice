# ticketing_microservice

This project showcases in a very simplistic way how microsservices communicate with eachother

To run this project you'll need minikube in the linux OS and for mac or windows docker desktop will do.
You'll need to set some envs in bash
```
kubectl create secret generic stripe-public-secret --from-literal STRIPE_PUBLIC_KEY=YOUR_KEY_HERE
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=YOUR_KEY_HERE
kubectl create secret generic jwt-secret --from-literal JWT_KEY=YOUR_KEY_HERE
```
You'll also need skaffold and change all lschulzes that you can find in the infra dir to your docker hub ID
After that run ```skaffold dev``` and you're good to go!
